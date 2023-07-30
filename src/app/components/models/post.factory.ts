import { Post } from 'src/app/components/models/post.model';

abstract class PostFactory {
  abstract createPost(): Post;
}

class LinkPostFactory extends PostFactory {
    createPost(): Post {
        return 
    }
}

class TextPostFactory extends PostFactory{
    createPost(): Post {
        throw new Error('Method not implemented.');
    }
}

class VideoPostFactory  extends PostFactory{
    createPost(): Post {
        throw new Error('Method not implemented.');
    }
}

class ImagePostFactory extends PostFactory {
    createPost(): Post {
        throw new Error('Method not implemented.');
    }
}
