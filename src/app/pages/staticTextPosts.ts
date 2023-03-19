import { TextPost } from 'src/app/components/models/text-post';

export const testPosts: TextPost[] = [
  {
    feedLocation: 'Main',
    postType: 'text',
    title: 'This is a Test Post',
    content: 'Lorem Ipsum Testy Test',
  },
  {
    feedLocation: 'Main',
    postType: 'text',
    title: 'This is a Test Post 2',
    content: 'Lorem  Test ',
  },
  {
    feedLocation: 'Main',
    postType: 'text',
    title: 'This is a Test Post 3',
    content: 'Lorem  Test ',
  },
];

export const staticTextPosts: TextPost[] = [
  {
    feedLocation: 'Puppy',
    postType: 'text',
    title: 'Puppy Update',
    content:
      "It was June 2020, I was really depressed and anxious about the pandemic\
        and it's effect on what I was doing for work and on my social life. I \
        was living at home with my parents, whom I love, but we sometimes have difficulty being\
        on top of each other especially during lockdowns.\
        My mom noticed how lousy I was feeling and she told me I could get a dog in hopes that it would ease my mind. \
        I've always wanted a dog since I had to say goodbye to my childhood pooch, Teddy. He was   \
        a majestic white Standard Poodle, a really great dog and everyone on my block loved him. \
        I was thrilled with the news and began researching breeders. Around October 2020, I found \
        a breeder and put a deposit down for a poodle puppy. By then, I had moved out of my parents house and \
        things had gotten better at work, but I was still determined to get my poodle. I believe it'll be great for my mental health.\
        The puppy was suppposed to be born around February time, but the mother never got pregnant and I was really disappointed. \
        The breeder let me know that this summer she was going to breed again, so I've been waiting\
        Today, June 2nd, I got word that the mother was being bred and the puppies should be on their way in about 8/9 weeks.\
         I'm so excited! Hopefully, which ever puppy belongs to me will be coming home with me Sept/Oct time!",
  },
  {
    feedLocation: 'Main',
    postType: 'text',
    title: 'Welcome!',
    content:
      'Welcome to this wonderful site about my work and life. Made from scratch using Angular 12 and Node.JS.\
        Hope you enjoy what you see!',
  },
  {
    feedLocation: 'Main',
    postType: 'link',
    title: 'Test Link Preview!',
    content: 'Test link https://www.youtube.com/watch?v=FpS2CncJXP8',
  },
  {
    feedLocation: 'Main',
    postType: 'link',
    title: 'Test Link Preview!',
    content: 'Test link https://www.youtube.com/watch?v=hiZaMbXC7O8',
  },
];
