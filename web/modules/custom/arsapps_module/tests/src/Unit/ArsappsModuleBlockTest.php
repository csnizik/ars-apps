<?php

declare(strict_types=1);

namespace Drupal\Tests\arsapps_module\Unit;

use Drupal\arsapps_module\Plugin\Block\ArsappsModuleBlock;
use Drupal\Tests\UnitTestCase;

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
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->block = new ArsappsModuleBlock(
      [],
      'arsapps_module_block',
      [
        'admin_label' => 'ARSApps Module Block',
        'provider' => 'arsapps_module',
      ]
    );
  }

  /**
   * Tests the build method returns correct render array structure.
   *
   * @covers ::build
   */
  public function testBuild(): void {
    $build = $this->block->build();

    $this->assertIsArray($build);
    $this->assertArrayHasKey('content', $build);
    $this->assertIsArray($build['content']);

    // Test render array structure.
    $this->assertArrayHasKey('#markup', $build['content']);
    $this->assertArrayHasKey('#prefix', $build['content']);
    $this->assertArrayHasKey('#suffix', $build['content']);

    // Test that markup is a TranslatableMarkup object.
    $markup = $build['content']['#markup'];
    $this->assertInstanceOf('Drupal\Core\StringTranslation\TranslatableMarkup', $markup);

    // Test prefix and suffix strings.
    $this->assertEquals('<div class="arsapps-module-block">', $build['content']['#prefix']);
    $this->assertEquals('</div>', $build['content']['#suffix']);
  }

  /**
   * Tests that the block implements the correct interface.
   *
   * @covers ::__construct
   */
  public function testBlockImplementsCorrectInterface(): void {
    $this->assertInstanceOf('Drupal\Core\Block\BlockPluginInterface', $this->block);
  }

  /**
   * Tests that the block can be instantiated.
   *
   * @covers ::__construct
   */
  public function testBlockInstantiation(): void {
    $this->assertInstanceOf(ArsappsModuleBlock::class, $this->block);
  }

}
