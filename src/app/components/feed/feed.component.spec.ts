import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FeedComponent } from './feed.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { AnyPostResponse, PostType } from '../models/post.model';

class MockDatabaseService {
  getMainPosts() {
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
    return of(posts);
  }
}

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [FeedComponent],
    providers: [{ provide: DatabaseService, useClass: MockDatabaseService }],
  })
    .overrideComponent(FeedComponent, {
      set: { template: '<div></div>', imports: [] },
    })
    .compileComponents();

  fixture = TestBed.createComponent(FeedComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('loads posts and sorts them by id descending', () => {
    const posts = component.posts();
    expect(posts.length).toBe(2);
    expect(posts[0].id).toBe(3);
    expect(posts[0].title_or_uri).toBe('Text Title');
    expect(posts[1].title_or_uri).toBe('https://example.com');
  });

  it('identifies text and link posts correctly', () => {
    const textPost = component.posts()[0];
    const linkPost = component.posts()[1];
    expect(component.isTextPost(textPost)).toBeTrue();
    expect(component.isLinkPost(linkPost)).toBeTrue();
    expect(component.isTextPost(linkPost)).toBeFalse();
    expect(component.isLinkPost(textPost)).toBeFalse();
  });

  it('tracks posts by id', () => {
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
