<?php

declare(strict_types=1);

namespace Drupal\novel\TwigCsFixer\Rules;

use Twig\Environment;
use Twig\Node\Expression\ConstantExpression;
use Twig\Node\Expression\FunctionExpression;
use Twig\Node\ModuleNode;
use Twig\Node\Node;
use Twig\Node\TextNode;
use TwigCsFixer\Rules\Node\AbstractNodeRule;

/**
 * Ensures twig templates attach CSS libraries for design system BEM blocks.
 *
 * Visits the Twig AST to find:
 * - attach_library('novel/<name>') function calls
 * - class="..." attributes in TextNode content
 *
 * Reports a warning for each BEM block that has a matching per-component
 * CSS file but no corresponding attach_library() call.
 */
final class RequireDesignSystemLibraryRule extends AbstractNodeRule
{
    /** @var array<string, bool> */
    private array $availableCssFiles = [];

    /** @var string[] */
    private array $ignorePatterns;

    /** @var array<string, Node> */
    private array $foundBlocks = [];

    /** @var array<string, bool> */
    private array $attachedLibraries = [];

    /** @var Token|null */
    private ?Node $firstNode = null;

    /**
     * @param string[] $ignorePatterns
     *   Regex patterns for class names to ignore (e.g. utility classes).
     */
    public function __construct(
        string $componentCssDir = '',
        array $ignorePatterns = [],
    ) {
        $this->ignorePatterns = $ignorePatterns;

        if ($componentCssDir !== '' && is_dir($componentCssDir)) {
            foreach (glob($componentCssDir . '/*.css') ?: [] as $file) {
                $name = basename($file, '.css');
                $this->availableCssFiles[$name] = true;
            }
        }
    }

    public function enterNode(Node $node, Environment $env): Node
    {
        if ($node instanceof ModuleNode) {
            $this->foundBlocks = [];
            $this->attachedLibraries = [];
            $this->firstNode = null;
        }

        if ($this->firstNode === null) {
            $this->firstNode = $node;
        }

        if ($node instanceof FunctionExpression) {
            $name = $node->getAttribute('name');
            if ($name === 'attach_library') {
                $args = $node->getNode('arguments');
                foreach ($args as $arg) {
                    if ($arg instanceof ConstantExpression) {
                        $val = $arg->getAttribute('value');
                        if (is_string($val) && str_starts_with($val, 'novel/')) {
                            $this->attachedLibraries[substr($val, 6)] = true;
                        }
                    }
                }
            }
        }

        if ($node instanceof TextNode) {
            $data = $node->getAttribute('data');
            if (is_string($data)) {
                $this->extractClassesFromText($data, $node);
            }
        }

        return $node;
    }

    public function leaveNode(Node $node, Environment $env): Node
    {
        if ($node instanceof ModuleNode) {
            $reported = [];
            foreach ($this->foundBlocks as $block => $blockNode) {
                if (!isset($this->attachedLibraries[$block]) && !isset($reported[$block])) {
                    $this->addWarning(
                        sprintf(
                            'BEM block "%s" requires {{ attach_library(\'novel/%s\') }}',
                            $block,
                            $block,
                        ),
                        $blockNode,
                        'RequireDesignSystemLibrary',
                    );
                    $reported[$block] = true;
                }
            }
        }

        return $node;
    }

    private function extractClassesFromText(string $text, Node $node): void
    {
        if (preg_match_all('/class="([^"]*)"/', $text, $matches) === false) {
            return;
        }
        foreach ($matches[1] as $classStr) {
            foreach (preg_split('/\s+/', $classStr) ?: [] as $cls) {
                $cls = trim($cls);
                if ($cls === '' || preg_match('/^[a-z]/', $cls) !== 1) {
                    continue;
                }
                $block = $this->getBemBlock($cls);
                if ($block !== null && isset($this->availableCssFiles[$block]) && !isset($this->foundBlocks[$block])) {
                    $this->foundBlocks[$block] = $node;
                }
            }
        }
    }

    private function getBemBlock(string $className): ?string
    {
        foreach ($this->ignorePatterns as $pattern) {
            if (preg_match($pattern, $className) === 1) {
                return null;
            }
        }

        if (preg_match('/^([a-z][a-z0-9-]*?)__/', $className, $m) === 1) {
            return $m[1];
        }
        if (preg_match('/^([a-z][a-z0-9-]*?)--/', $className, $m) === 1) {
            return $m[1];
        }

        return $className;
    }
}
