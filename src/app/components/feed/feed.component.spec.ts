import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { FeedComponent } from './feed.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { AnyPostResponse, PostType } from '../models/post.model';

class MockDatabaseService {
  readonly posts$ = new Subject<AnyPostResponse[]>();

  getMainPosts() {
    return this.posts$;
  }
}

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let db: MockDatabaseService;
  const posts: AnyPostResponse[] = [
    {
      id: 2,
      title: 'Link Title',
      uri: 'https://example.com',
      type: PostType.LinkPost,
      content: '',
      location: '',
      title_or_uri: '',
    },
    {
      id: 3,
      title: 'Text Title',
      uri: '',
      type: PostType.TextPost,
      content: 'Body',
      location: '',
      title_or_uri: '',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [{ provide: DatabaseService, useClass: MockDatabaseService }],
    })
      .overrideComponent(FeedComponent, {
        set: { template: '<div></div>', imports: [] },
      })
      .compileComponents();

    db = TestBed.inject(DatabaseService) as unknown as MockDatabaseService;
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads posts and sorts them by id descending', () => {
    db.posts$.next(posts);

    const loadedPosts = component.posts();
    expect(loadedPosts.length).toBe(2);
    expect(loadedPosts[0].id).toBe(3);
    expect(loadedPosts[0].title_or_uri).toBe('Text Title');
    expect(loadedPosts[1].title_or_uri).toBe('https://example.com');
  });

  it('starts in loading state', () => {
    expect(component.feedState()).toBe('loading');
    expect(component.posts()).toEqual([]);
  });

  it('sets ready state when posts load', () => {
    db.posts$.next(posts);

    expect(component.feedState()).toBe('ready');
  });

  it('sets empty state when no posts load', () => {
    db.posts$.next([]);

    expect(component.feedState()).toBe('empty');
    expect(component.posts()).toEqual([]);
  });

  it('sets error state when post loading fails', () => {
    db.posts$.error(new Error('boom'));

    expect(component.feedState()).toBe('error');
  });

  it('identifies text and link posts correctly', () => {
    db.posts$.next(posts);

    const textPost = component.posts()[0];
    const linkPost = component.posts()[1];
    expect(component.isTextPost(textPost)).toBeTrue();
    expect(component.isLinkPost(linkPost)).toBeTrue();
    expect(component.isTextPost(linkPost)).toBeFalse();
    expect(component.isLinkPost(textPost)).toBeFalse();
  });

  it('tracks posts by id', () => {
    db.posts$.next(posts);

    const post = component.posts()[0];
    expect(component.trackByPostId(0, post)).toBe(post.id);
  });

  it('returns 0 from sortPosts when ids are equal', () => {
    const post: AnyPostResponse = {
      id: 1,
      title: 'Equal',
      uri: '',
      type: PostType.TextPost,
      content: '',
      location: '',
      title_or_uri: '',
    };
    expect(component.sortPosts(post, { ...post })).toBe(0);
  });
});
