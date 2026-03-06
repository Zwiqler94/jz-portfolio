import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { GalleryItemData } from 'ngx-gallery-jz';

import { PhotoGalleryComponent } from './photo-gallery.component';
import { ImageService } from 'src/app/services/image/image.service';

class MockImageService {
  formatForCloudinaryProvider(url: string) {
    return `formatted:${url}`;
  }
}

describe('PhotoGalleryComponent', () => {
  let component: PhotoGalleryComponent;
  let fixture: ComponentFixture<PhotoGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGalleryComponent],
      providers: [{ provide: ImageService, useClass: MockImageService }],
    })
      .overrideComponent(PhotoGalleryComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(PhotoGalleryComponent);
    component = fixture.componentInstance;
  });

  function createGrid(size: number): GalleryItemData[] {
    return Array.from({ length: size }, (_, i) => ({
      src: `src-${i}`,
      thumb: `thumb-${i}`,
    }));
  }

  it('initialises display grids according to page size', () => {
    fixture.componentRef.setInput('photoGrids', [createGrid(3)]);
    component.pageSize.set(2);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.displayGrids[0].length).toBe(2);
  });

  it('updates the current page slice on page change', () => {
    fixture.componentRef.setInput('photoGrids', [createGrid(5)]);
    component.pageSize.set(2);
    fixture.detectChanges();
    component.ngOnInit();

    const event: PageEvent = {
      pageIndex: 1,
      previousPageIndex: 0,
      pageSize: 2,
      length: 5,
    };
    component.onPageChange(event, 0);

    const indexes = component.generateGalleryIndexes(event);
    expect(component.displayGrids[0]).toEqual(
      component.photoGrids()[0].slice(indexes.startIdx, indexes.endIdx),
    );
  });

  it('computes gallery indexes for navigating backwards and forwards', () => {
    component.pageSize.set(3);
    const backward: PageEvent = {
      pageIndex: 1,
      previousPageIndex: 3,
      pageSize: 3,
      length: 12,
    };
    const backwardIndexes = component.generateGalleryIndexes(backward);
    expect(backwardIndexes.startIdx).toBe(4);

    const reset: PageEvent = {
      pageIndex: 0,
      previousPageIndex: 2,
      pageSize: 3,
      length: 12,
    };
    const resetIndexes = component.generateGalleryIndexes(reset);
    expect(resetIndexes.endIdx).toBe(3);
  });

  it('computes indexes when moving forward', () => {
    component.pageSize.set(4);
    const forward: PageEvent = {
      pageIndex: 2,
      previousPageIndex: 1,
      pageSize: 4,
      length: 20,
    };
    const indexes = component.generateGalleryIndexes(forward);
    expect(indexes.startIdx).toBe(4);
  });

  it('computes indexes when no previous page exists', () => {
    component.pageSize.set(4);
    const firstPage: PageEvent = {
      pageIndex: 0,
      previousPageIndex: undefined,
      pageSize: 4,
      length: 20,
    };
    const indexes = component.generateGalleryIndexes(firstPage);
    expect(indexes.startIdx).toBe(5);
  });

  it('delegates URL formatting to the image service', () => {
    const result = component.formatForCloudinaryProvider('foo');
    expect(result).toBe('formatted:foo');
  });

  it('returns a class name from the palette', () => {
    const result = component.getRandomClass();
    expect(typeof result).toBe('string');
    expect(result.trim().length).toBeGreaterThan(0);
  });
});
