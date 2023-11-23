import { Post } from 'src/app/components/models/post.model';

abstract class PostFactory {
  abstract createPost(): void;
}

class LinkPostFactory extends PostFactory {
  createPost(): Post {
    throw new Error('Method not implemented.');
  }
}

class TextPostFactory extends PostFactory {
  createPost(): Post {
    throw new Error('Method not implemented.');
  }
}

class VideoPostFactory extends PostFactory {
  createPost(): Post {
    throw new Error('Method not implemented.');
  }
}

class ImagePostFactory extends PostFactory {
  createPost(): Post {
    throw new Error('Method not implemented.');
  }
}
