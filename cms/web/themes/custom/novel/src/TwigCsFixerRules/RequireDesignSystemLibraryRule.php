<?php

declare(strict_types=1);

namespace Drupal\novel\TwigCsFixerRules;

use function Safe\preg_match;
use function Safe\preg_match_all;
use function Safe\preg_split;

use Twig\Environment;
use Twig\Node\Expression\ConstantExpression;
use Twig\Node\Expression\FunctionExpression;
use Twig\Node\ModuleNode;
use Twig\Node\Node;
use Twig\Node\TextNode;
use TwigCsFixer\Rules\Node\AbstractNodeRule;

/**
 * Ensures twig templates attach libraries for BEM blocks they use.
 *
 * Visits the Twig AST to find:
 * - attach_library('<prefix><name>') function calls
 * - class="..." attributes in TextNode content.
 *
 * Reports a warning for each BEM block that does not have a matching
 * attach_library call and is not matched by any ignore pattern.
 */
final class RequireDesignSystemLibraryRule extends AbstractNodeRule {

  /**
   * BEM blocks found during AST traversal.
   *
   * @var array<string, Node>
   */
  private array $foundBlocks = [];

  /**
   * Libraries attached via attach_library() during traversal.
   *
   * @var array<string, bool>
   */
  private array $attachedLibraries = [];

  /**
   * Constructs the rule.
   *
   * @param string[] $ignorePatterns
   *   Regex patterns for class names to skip (e.g. third-party classes).
   * @param string $libraryPrefix
   *   Prefix for attach_library calls (e.g. 'novel/').
   */
  public function __construct(
    private readonly array $ignorePatterns = [],
    private readonly string $libraryPrefix = 'novel/',
  ) {
  }

  /**
   * {@inheritDoc}
   */
  public function enterNode(Node $node, Environment $env): Node {
    if ($node instanceof ModuleNode) {
      $this->foundBlocks = [];
      $this->attachedLibraries = [];
    }

    if ($node instanceof FunctionExpression) {
      $name = $node->getAttribute('name');
      if ($name === 'attach_library') {
        $args = $node->getNode('arguments');
        foreach ($args as $arg) {
          if ($arg instanceof ConstantExpression) {
            $val = $arg->getAttribute('value');
            if (is_string($val) && str_starts_with($val, $this->libraryPrefix)) {
              $this->attachedLibraries[substr($val, strlen($this->libraryPrefix))] = TRUE;
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

  /**
   * {@inheritDoc}
   */
  public function leaveNode(Node $node, Environment $env): Node {
    if ($node instanceof ModuleNode) {
      $this->reportViolations();
    }

    return $node;
  }

  /**
   * Report BEM blocks that have no matching attach_library call.
   */
  private function reportViolations(): void {
    $reported = [];
    foreach ($this->foundBlocks as $block => $blockNode) {
      if (isset($reported[$block]) || isset($this->attachedLibraries[$block])) {
        continue;
      }

      $this->addWarning(
        sprintf(
          'BEM block "%s" requires {{ attach_library(\'%s%s\') }}',
          $block,
          $this->libraryPrefix,
          $block,
        ),
        $blockNode,
        'RequireDesignSystemLibrary',
      );

      $reported[$block] = TRUE;
    }
  }

  /**
   * Extract BEM class names from HTML class attributes in text.
   */
  private function extractClassesFromText(string $text, Node $node): void {
    if (preg_match_all('/class="([^"]*)"/', $text, $matches) === 0) {
      return;
    }
    foreach ($matches[1] as $classStr) {
      foreach (preg_split('/\s+/', $classStr) as $cls) {
        $cls = trim($cls);
        if ($cls === '' || preg_match('/^[a-z]/', $cls) === 0) {
          continue;
        }
        $block = $this->getBemBlock($cls);
        if ($block !== NULL && !isset($this->foundBlocks[$block])) {
          $this->foundBlocks[$block] = $node;
        }
      }
    }
  }

  /**
   * Extract the BEM block name from a CSS class name.
   */
  private function getBemBlock(string $className): ?string {
    foreach ($this->ignorePatterns as $pattern) {
      if (preg_match($pattern, $className) === 1) {
        return NULL;
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
