<?php

declare(strict_types=1);

namespace Drupal\Tests\arsapps_module\Unit;

use Drupal\arsapps_module\Plugin\Block\ArsappsModuleBlock;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Tests\UnitTestCase;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * Unit tests for ArsappsModuleBlock.
 *
 * @coversDefaultClass \Drupal\arsapps_module\Plugin\Block\ArsappsModuleBlock
 * @group arsapps_module
 */
final class ArsappsModuleBlockTest extends UnitTestCase {

  /**
   * The block plugin under test.
   */
  private ArsappsModuleBlock $block;

  /**
   * Mock translation service.
   *
   * @var \Drupal\Core\StringTranslation\TranslationInterface&\PHPUnit\Framework\MockObject\MockObject
   */
  private TranslationInterface&MockObject $stringTranslation;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->stringTranslation = $this->createMock(TranslationInterface::class);

    $this->block = new ArsappsModuleBlock(
      [],
      'arsapps_module_block',
      [
        'admin_label' => 'ARSApps Module Block',
        'provider' => 'arsapps_module',
      ]
    );
    $this->block->setStringTranslation($this->stringTranslation);
  }

  /**
   * Tests the build method returns correct render array structure.
   *
   * @covers ::build
   */
  public function testBuild(): void {
    $expected_text = 'This is a placeholder block from ARSApps Module. It demonstrates basic block plugin functionality for testing and development purposes.';
    
    $this->stringTranslation
      ->method('translate')
      ->willReturn($expected_text);

    $build = $this->block->build();

    $this->assertIsArray($build);
    $this->assertArrayHasKey('content', $build);
    $this->assertArrayHasKey('#markup', $build['content']);
    $this->assertArrayHasKey('#prefix', $build['content']);
    $this->assertArrayHasKey('#suffix', $build['content']);

    // The #markup will be a TranslatableMarkup object with mocked translation
    $markup = $build['content']['#markup'];
    $this->assertInstanceOf('Drupal\Core\StringTranslation\TranslatableMarkup', $markup);
    $this->assertEquals($expected_text, (string) $markup);
    $this->assertEquals('<div class="arsapps-module-block">', $build['content']['#prefix']);
    $this->assertEquals('</div>', $build['content']['#suffix']);
  }

  /**
   * Tests that the block implements the correct interface.
   */
  public function testBlockImplementsCorrectInterface(): void {
    $this->assertInstanceOf('Drupal\Core\Block\BlockPluginInterface', $this->block);
  }

}
