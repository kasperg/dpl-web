<?php

declare(strict_types=1);

namespace Drupal\Tests\novel\Unit\TwigCsFixerRules;

use Drupal\novel\TwigCsFixerRules\RequireDesignSystemLibraryRule;
use TwigCsFixer\Test\AbstractRuleTestCase;

/**
 * Tests for RequireDesignSystemLibraryRule.
 */
final class RequireDesignSystemLibraryRuleTest extends AbstractRuleTestCase {

  /**
   * Template with library attached produces no violations.
   */
  public function testLibraryAttached(): void {
    $this->checkRule(
      new RequireDesignSystemLibraryRule(
        libraryPrefix: 'novel/',
      ),
      [],
      __DIR__ . '/Fixtures/LibraryAttached.twig',
      FALSE,
    );
  }

  /**
   * Template missing library produces a warning.
   */
  public function testMissingLibrary(): void {
    $this->checkRule(
      new RequireDesignSystemLibraryRule(
        libraryPrefix: 'novel/',
      ),
      [
        'RequireDesignSystemLibrary.RequireDesignSystemLibrary:1' =>
        'BEM block "error-message" requires {{ attach_library(\'novel/error-message\') }}',
      ],
      __DIR__ . '/Fixtures/MissingLibrary.twig',
      FALSE,
    );
  }

  /**
   * Ignored classes produce no violations.
   */
  public function testIgnoredClasses(): void {
    $this->checkRule(
      new RequireDesignSystemLibraryRule(
        ignorePatterns: ['/^ssc/', '/^swiper/', '/^w-\d+$/'],
        libraryPrefix: 'novel/',
      ),
      [],
      __DIR__ . '/Fixtures/IgnoredClasses.twig',
      FALSE,
    );
  }

  /**
   * Block without library produces a warning regardless of CSS files.
   */
  public function testUnknownBlock(): void {
    $this->checkRule(
      new RequireDesignSystemLibraryRule(
        libraryPrefix: 'novel/',
      ),
      [
        'RequireDesignSystemLibrary.RequireDesignSystemLibrary:1' =>
        'BEM block "nonexistent-component" requires {{ attach_library(\'novel/nonexistent-component\') }}',
      ],
      __DIR__ . '/Fixtures/UnknownBlock.twig',
      FALSE,
    );
  }

  /**
   * Custom library prefix works.
   */
  public function testCustomPrefix(): void {
    $this->checkRule(
      new RequireDesignSystemLibraryRule(
        libraryPrefix: 'mytheme/',
      ),
      [],
      __DIR__ . '/Fixtures/CustomPrefix.twig',
      FALSE,
    );
  }

}
