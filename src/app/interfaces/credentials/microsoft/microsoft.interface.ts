import { LearningCredential } from 'src/app/interfaces/credentials/credential.interface';

interface AchievementCategory {
  [key: string]: number;
}

export interface Achievement {
  category: string;
  typeId: string;
  userId: string;
  id: string;
  title: string;
  imageUrl: string;
  locale: string;
  verified: boolean;
  source: string;
  grantedOn: string;
  url: string;
  milestoneEligible: boolean;
  version: number;
}

interface XP {
  xp: {
    docsId: string;
    totalXp: number;
    currentLevel: number;
    currentLevelLow: number;
    currentLevelHigh: number;
    currentLevelPointsEarned: number;
    nextLevel: number;
    pointsUntilNextLevel: number;
    achievementCategories: AchievementCategory;
  };
  achievements: Achievement[];
}

interface CompletedLearningItem {
  title: string;
  type: string;
  completedAt: string;
}

interface Progress {
  completedLearningItems: CompletedLearningItem[];
}

interface List {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: string;
  lastModified: string;
  totalItems: number;
  items: any[]; // Array type can be specified if known
  itemCount: number;
  sections: any[]; // Array type can be specified if known
  sectionCount: number;
  isPrivate: boolean;
  isOfficial: boolean;
  shouldLocalize: boolean;
  isLocalized: boolean;
  isFallbackLocale: boolean;
  showUserDisplayName: boolean;
  moduleCount: number;
  completedModuleCount: number;
  remainingDuration: number;
  totalDuration: number;
}

interface CreatedSkillingPlans {
  userId: string;
  skillingPlanFilter: number;
  skillingPlans: any[]; // Array type can be specified if known
  count: number;
}

interface CreatedLearnChallenges {
  userId: string;
  learnChallengeFilter: number;
  challenges: any[]; // Array type can be specified if known
  count: number;
}

interface Lists {
  userId: string;
  lists: List[];
  createdSkillingPlans: CreatedSkillingPlans;
  createdLearnChallenges: CreatedLearnChallenges;
}

interface AuthenticationMode {
  id: string;
  type: string;
  tenantId: string;
  upn: string;
  oid: string;
  dateAcceptedPrivacyNotice: string;
  dateAdded: string;
}

interface PublicLink {
  showModules: boolean;
  showLegalName: boolean;
  showMCID: boolean;
  showContactEmail: boolean;
}

interface Print {
  showModules: boolean;
  showLegalName: boolean;
  showMCID: boolean;
  showContactEmail: boolean;
}

interface TranscriptSettings {
  publicLink: PublicLink;
  print: Print;
}

interface CertificationSettings {
  print: Print;
}

interface EmailEventSettings {
  newMention: string;
  newModeration: string;
  answerPosted: string;
  answerAccepted: string;
  commentPosted: string;
  newPrivateMessage: string;
}

interface QnaEmailPreferences {
  allEmail: boolean;
  autoFollowAsked: boolean;
  autoFollowAnswered: boolean;
  autoFollowCommented: boolean;
  autoFollowTagged: boolean;
  emailEventSettings: EmailEventSettings;
}

interface TechProfile {
  email: string;
  locale: string;
  country: string;
  contactPointTopicSetting: string;
  isInstructor: boolean;
  isChallengeAdmin: boolean;
  isQnaModerator: boolean;
  source: string;
  authenticationModes: AuthenticationMode[];
  groups: any[]; // Array type can be specified if known
  transcriptSettings: TranscriptSettings;
  certificationSettings: CertificationSettings;
  qnaEmailPreferences: QnaEmailPreferences;
  sharingId: string;
  userId: string;
  userName: string;
  displayName: string;
  isPrivate: boolean;
  affiliations: any[]; // Array type can be specified if known
  followerCount: number;
  followingCount: number;
  answersAccepted: number;
  reputationPoints: number;
  createdOn: string;
}

interface QnA {
  docsId: string;
  questions: unknown[]; // Array type can be specified if known
  answers: unknown[]; // Array type can be specified if known
  comments: unknown[]; // Array type can be specified if known
}

export class MicrosoftLearnUserProfile {
  attachments: boolean;
  xp: XP;
  progress: Progress;
  certifications: null;
  verifiableCredentials: { docsId: string; userCredentials: any[] }; // Array typecan be specified if known
  skillAssessment: null;
  assessments: null;
  nextSteps: null;
  challenges: { Table: unknown[] }; // Array type can be specified if known
  lists: Lists;
  techProfile: TechProfile;
  qnA: QnA;

  constructor(profileComponents: any) {
    console.debug({ profileComponents });
    this.attachments = profileComponents.Attachments;
    this.xp = profileComponents.XP;
    this.progress = profileComponents.Progress;
    this.certifications = profileComponents.Certifications;
    this.verifiableCredentials = {
      docsId: profileComponents?.VerfiableCredentials?.docsId,
      userCredentials: profileComponents?.VerfiableCredentials?.userCredentials,
    }; // Array type can be specified if known
    this.skillAssessment = profileComponents.SkillAssessments;
    this.assessments = profileComponents.Assessments;
    this.nextSteps = profileComponents.NextSteps;
    this.challenges = { Table: profileComponents?.Challenges?.Table }; // Array type can be specified if known
    this.lists = profileComponents.Lists;
    this.techProfile = profileComponents.TechProfile;
    this.qnA = profileComponents.QnA;
  }
}
