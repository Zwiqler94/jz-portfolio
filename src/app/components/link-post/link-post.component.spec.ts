// link-post.component.spec.ts
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LinkPostComponent } from './link-post.component';
import { LinkPreview } from 'src/app/components/models/post.model';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { MissingLinkPreviewData } from 'src/app/components/models/post.model';

class MockLinkPreviewService {
  getLinkPreview = jasmine.createSpy('getLinkPreview');
}

class MockDatabaseService {
  savePreviewData = jasmine.createSpy('savePreviewData');
  getPreviewData = jasmine.createSpy('getPreviewData');
}

describe('LinkPostComponent (signal inputs)', () => {
  let fixture: ComponentFixture<LinkPostComponent>;
  let component: LinkPostComponent;
  let linkPreview: MockLinkPreviewService;
  let db: MockDatabaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkPostComponent], // standalone component
      providers: [
        { provide: LinkPreviewService, useClass: MockLinkPreviewService },
        { provide: DatabaseService, useClass: MockDatabaseService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPostComponent);
    component = fixture.componentInstance;
    linkPreview = TestBed.inject(
      LinkPreviewService,
    ) as unknown as MockLinkPreviewService;
    db = TestBed.inject(DatabaseService) as unknown as MockDatabaseService;
  });

  it('should create', () => {
    // required input
    fixture.componentRef.setInput('content', 'hello');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('fetches and stores preview when image_uri is missing', fakeAsync(() => {
    const data: LinkPreview = {
      title: 'Title',
      description: 'Desc',
      image: 'img.png',
      url: 'https://ex.com',
    };
    linkPreview.getLinkPreview.and.returnValue(of(data));
    db.savePreviewData.and.returnValue(of({ ok: true } as any));

    fixture.componentRef.setInput('id', 7);
    fixture.componentRef.setInput('content', 'Look: https://ex.com');
    fixture.componentRef.setInput('title_or_uri', 'https://ex.com');
    // no image_uri set
    fixture.detectChanges();
    tick(); // flush observable callbacks

    expect(linkPreview.getLinkPreview).toHaveBeenCalledWith('https://ex.com');
    expect(component.previewData).toEqual(data);
    expect(db.savePreviewData).toHaveBeenCalledWith(7, data);
  }));

  it('uses cached preview when image_uri is present', fakeAsync(() => {
    db.getPreviewData.and.returnValue(
      of({ title: 'Cached', uri: 'https://ex.com' }),
    );

    fixture.componentRef.setInput('id', 9);
    fixture.componentRef.setInput('content', 'whatever');
    fixture.componentRef.setInput('title_or_uri', 'https://ex.com');
    fixture.componentRef.setInput('image_uri', 'https://img/cached.png');
    fixture.detectChanges();
    tick();

    expect(db.getPreviewData).toHaveBeenCalledWith(9);
    expect(component.previewData).toEqual({
      title: 'Cached',
      description: '',
      image: 'https://img/cached.png',
      url: 'https://ex.com',
    });
    expect(linkPreview.getLinkPreview).not.toHaveBeenCalled();
  }));

  it('falls back to MissingLinkPreviewData on service error', fakeAsync(() => {
    linkPreview.getLinkPreview.and.returnValue(
      throwError(() => new Error('boom')),
    );

    fixture.componentRef.setInput('id', 3);
    fixture.componentRef.setInput('content', 'x');
    fixture.componentRef.setInput('title_or_uri', 'https://bad.example');
    fixture.detectChanges();
    tick();

    expect(component.previewData).toEqual(MissingLinkPreviewData);
  }));
});
