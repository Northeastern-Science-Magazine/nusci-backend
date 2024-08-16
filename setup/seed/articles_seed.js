import ArticleContent from "../../app/models/enums/articleContent.js";
import ArticleStatus from "../../app/models/enums/articleStatus.js";
import CommentStatus from "../../app/models/enums/commentStatus.js";
import DesignStatus from "../../app/models/enums/designStatus.js";
import PhotographyStatus from "../../app/models/enums/photographyStatus.js";
import WritingStatus from "../../app/models/enums/writingStatus.js";
import mongoose from "mongoose";

export default [
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000000"),
    title: "Exploring the Future: AI Integration in Everyday Life",
    slug: "exploring-the-future-ai-integration-in-everyday-life",
    issueNumber: 1,
    categories: ["technology", "science"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "As artificial intelligence continues to advance at an unprecedented pace, its integration into everyday life becomes more profound.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "From virtual assistants managing our schedules to predictive algorithms driving personalized recommendations, AI is reshaping the way we live, work, and interact with technology.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "However, with this integration comes ethical considerations and concerns about privacy, bias, and job displacement.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content:
          "The potential benefits of AI integration are vast, but it's crucial to address the ethical implications to ensure a responsible and equitable future.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "As we embrace AI in our daily lives, it's essential to prioritize transparency, accountability, and inclusivity in its development and deployment.",
      },
    ],
    sources: ["NYTimes", "Hollywood Report"],
    link: "https://example.com/article-link",
    pageLength: 3,
    comments: [
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000008"),
        comment: "Fascinating read! AI's impact on society is both exciting and daunting.",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-03-31"),
        modificationTime: new Date("2024-03-31"),
      },
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000003"),
        comment: "This article raises important questions about the future of AI ethics and governance.",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-04-01"),
        modificationTime: new Date("2024-04-01"),
      },
    ],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [
      new mongoose.Types.ObjectId("b00000000000000000000005"),
      new mongoose.Types.ObjectId("b00000000000000000000006"),
    ],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    approvalTime: new Date("2024-04-2"),
    creationTime: new Date("2024-03-30"),
    modificationTime: new Date("2024-03-30"),
  },
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000001"),
    title: "Mark S. W. Sweess reflects on success, creativity, making mistakes and his time at Northeastern",
    slug: "mark-s-w-sweess-reflects-on-success-creativity-making-mistakes-and-his-time-at-northeastern",
    issueNumber: 4,
    categories: ["technology"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content: "Three decades later, Sweess looks back on the moments that have defined his path to notoriety.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "The Zippie data structure failed to take off upon Beta release, but years later in 1997, Sweess sold the rights to Oracle where it became a household name.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "“At the time, I certainly didn’t know where things would end up, but I had a great experience and I learned quite a bit about the music industry that I am really grateful for now,” Sweess says.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content:
          "Sweess' rapid rise is a success story in the tech industry, but the journey for him started at Northeastern.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content: "Sweess' achievements would go on to define the modern tech industry as we know it today.",
      },
    ],
    sources: ["YouTube", "Reddit"],
    link: "https://example2.com/article-link",
    pageLength: 1,
    comments: [
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000004"),
        comment: "Great article! Sweess inspired me to become a computer scientist!",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-03-28"),
        modificationTime: new Date("2024-03-28"),
      },
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000007"),
        comment: "This guy's a yapper",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-03-29"),
        modificationTime: new Date("2024-03-29"),
      },
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000004"),
        comment: "Cool article, learned a ton!",
        commentStatus: CommentStatus.Unresolved.status,
        creationTime: new Date("2024-03-30"),
        modificationTime: new Date("2024-03-30"),
        _id: "66ba07fc440f0ccec39b317d",
      },
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000004"),
        comment: "Amazing article, learned a ton!",
        commentStatus: CommentStatus.Resolved.status,
        creationTime: new Date("2024-03-30"),
        modificationTime: new Date("2024-03-30"),
        _id: "66ba07fc440f0ccec39b317a",
      },
    ],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [
      new mongoose.Types.ObjectId("b00000000000000000000005"),
      new mongoose.Types.ObjectId("b00000000000000000000006"),
    ],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
    approvalTime: new Date("2024-03-29"),
    creationTime: new Date("2024-03-27"),
    modificationTime: new Date("2024-03-27"),
  },
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000002"),
    title: "World Death Rate Holding Steady at 100 Percent",
    slug: "world-death-rate-holding-steady-at-100-percent",
    issueNumber: 902,
    categories: ["newsletter", "health"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "World Health Organization officials expressed disappointment Monday at the group's finding that, despite the enormous efforts of doctors, rescue workers and other medical professionals worldwide, the global death rate remains constant at 100 percent.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "Death, a metabolic affliction causing total shutdown of all life functions, has long been considered humanity's number one health concern.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content: "Responsible for 100 percent of all recorded fatalities worldwide, the condition has no cure.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content: "Death, experts say, affects not only the dead, but the non-dead as well.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "In the most serious cases of death, the trauma inflicted upon these still-living victims of death may continue throughout their entire lives, until their own deaths.",
      },
    ],
    sources: ["Onion", "YouTube"],
    link: "https://example3.com/article-link",
    pageLength: 2,
    comments: [
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000002"),
        comment: "This was a very interesting article.",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-03-26"),
        modificationTime: new Date("2024-03-26"),
      },
      {
        user: new mongoose.Types.ObjectId("b00000000000000000000008"),
        comment: "Certainly one of the most articles out there.",
        commentStatus: CommentStatus.Public.status,
        creationTime: new Date("2024-03-27"),
        modificationTime: new Date("2024-03-27"),
      },
    ],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [new mongoose.Types.ObjectId("b00000000000000000000005")],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    approvalTime: new Date("2024-03-27"),
    creationTime: new Date("2024-03-25"),
    modificationTime: new Date("2024-03-25"),
  },
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000003"),
    title: "Discovery of Ancient Flying Machine Leaves Scientists Baffled",
    slug: "discovery-of-ancient-flying-machine-leaves-scientists-baffled",
    issueNumber: 89,
    categories: ["science"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "In a groundbreaking excavation near the foothills of the Andes Mountains, researchers unearthed what appears to be remnants of an ancient flying machine, challenging conventional beliefs about early human technology.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "Professor Elena Ramirez, lead archaeologist on the project, described the find as 'extraordinary' and 'unlike anything we've ever encountered.'",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "The machine, composed of lightweight metals and intricate mechanisms, suggests a level of engineering prowess far ahead of its time, prompting speculation about its potential use and origin.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content: "The discovery challenges our understanding of ancient civilizations and their technological capabilities.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content:
          "'This isn't just a game-changer; it's a paradigm shift in archaeology,' remarked Dr. Miguel Hernandez, a renowned expert in pre-Columbian cultures.",
      },
    ],
    sources: ["National Geographic", "Scientific American"],
    link: "https://example4.com/article-link",
    pageLength: 5,
    comments: [],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [new mongoose.Types.ObjectId("b00000000000000000000006")],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
    approvalTime: new Date("2024-03-30"),
    creationTime: new Date("2024-03-28"),
    modificationTime: new Date("2024-03-28"),
  },
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000004"),
    title: "Archaeological Dig Uncovers Ancient Race Of Skeleton People",
    slug: "archaeological-dig-uncovers-ancient-race-of-skeleton-people",
    issueNumber: 29,
    categories: ["biology"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "A team of British and Egyptian archaeologists made a stunning discovery Monday, unearthing several intact specimens of 'skeleton people'",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "“This is an incredible find,” said Dr. Christian Hutchins, Oxford University archaeologist and head of the dig team.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content: "Imagine: At one time, this entire area was filled with spooky, bony, walking skeletons.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content:
          "The skeletons lived in this mud-brick structure, which, based on what we know of these people, was probably haunted.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content:
          "the skeletons bear numerous similarities to humans, leading him to suspect that there may be an evolutionary link between the two species.",
      },
    ],
    sources: ["The Economist", "NYTimes"],
    link: "https://example5.com/article-link",
    pageLength: 2,
    comments: [],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [
      new mongoose.Types.ObjectId("b00000000000000000000005"),
      new mongoose.Types.ObjectId("b00000000000000000000006"),
    ],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    approvalTime: new Date("2024-03-29"),
    creationTime: new Date("2024-03-27"),
    modificationTime: new Date("2024-03-27"),
  },
  {
    _id: new mongoose.Types.ObjectId("a00000000000000000000005"),
    title: "World Death Rate Holding Steady at 100 Percent",
    slug: "world-death-rate-holding-steady-at-100-percent-2",
    issueNumber: 3,
    categories: ["newsletter", "health"],
    articleContent: [
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "World Health Organization officials expressed disappointment Monday at the group's finding that, despite the enormous efforts of doctors, rescue workers and other medical professionals worldwide, the global death rate remains constant at 100 percent.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "Death, a metabolic affliction causing total shutdown of all life functions, has long been considered humanity's number one health concern.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content: "Responsible for 100 percent of all recorded fatalities worldwide, the condition has no cure.",
      },
      {
        contentType: ArticleContent.PullQuote.type,
        content: "Death, experts say, affects not only the dead, but the non-dead as well.",
      },
      {
        contentType: ArticleContent.BodyParagraph.type,
        content:
          "In the most serious cases of death, the trauma inflicted upon these still-living victims of death may continue throughout their entire lives, until their own deaths.",
      },
    ],
    sources: ["Onion", "YouTube"],
    link: "https://example6.com/article-link",
    pageLength: 2,
    comments: [],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Needs_Editor.status,
    designStatus: DesignStatus.Needs_Designer.status,
    photographyStatus: PhotographyStatus.Needs_Photographer.status,
    authors: [new mongoose.Types.ObjectId("b00000000000000000000008")],
    editors: [new mongoose.Types.ObjectId("b00000000000000000000005")],
    designers: [new mongoose.Types.ObjectId("b00000000000000000000007")],
    photographers: [new mongoose.Types.ObjectId("b00000000000000000000004")],
    approvingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
    approvalTime: new Date("2024-03-27"),
    creationTime: new Date("2024-03-25"),
    modificationTime: new Date("2024-03-25"),
  },
];
