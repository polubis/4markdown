/* eslint-disable no-template-curly-in-string */
import type {
  API4MarkdownDto,
  PublicDocumentDto,
  UserProfileDto,
} from "api-4markdown-contracts";
import { BASE_COMMANDS } from "../utils/commands";
import { gherkin } from "../utils/gherkin";

const now = new Date();

const getDocsResponse: { result: PublicDocumentDto[] } = {
  result: [
    {
      id: `e9799f7b-013e-4231-88fe-e2072514f96a`,
      name: `Mediator pattern in TypeScript`,
      path: `/mediator-pattern-in-typescript/`,
      code: `> This article was inspired by the scientific research **Meta-Analysis by Amato and Keith (1991)**, which examines the impact of parental divorce on children's brains.\n\n# **Mediator** Pattern In **TypeScript**\n\nThe **Mediator** pattern is less known among developers, but it is incredibly useful in complex cases for **reducing dependencies** between modules and mitigating [coupling](https://4markdown.com/coupling-explained-in-typescript/). I have used it a few times in my career, and interestingly, we often use such patterns **without realizing it**.\n\nMentioned one can dramatically reduce the complexity of our codebase or increase it if not implemented wisely. While entire books could be written on this topic, this small article should highlight the essence: [Design patterns should be called upon naturally, not forced.](https://4markdown.com/be-careful-when-using-design-patterns/).\n\nToday, we'll explore Mediator concept, understand the theory, and implement it in TypeScript to enhance our skill set.\n\n## **Mediator** Definition and Theory\n\n> The Mediator is a **behavioral design pattern** that centralizes complex communication and control logic between objects through a Mediator object, promoting loose coupling and reducing dependencies.\n\nTo make this concept more relatable and refer to a real-world example, imagine you are going through a divorce with your spouse (hopefully not). You both dislike each other so much that direct communication is impossible. However, you share responsibilities like a house, children, and other assets.\n\nAt this point, your friend recommends calling a **Mediator** - yes, that’s the name of the pattern and the job. This Mediator will handle all communications and responsibilities between you and your spouse. They convey information in a neutral manner and manage required actions, such as paperwork and financial negotiations, allowing you both to avoid direct interaction.\n\nLet's illustrate the dependencies on a diagram, both before and after involving a Mediator.\n\n![The Family Mediator On Diagram](https://firebasestorage.googleapis.com/v0/b/markdown-b9f5e.appspot.com/o/AQf2hcbxgSevVmNGPhRZTJg4M7D3%2Fimages%2F61abebb0-bc5b-4cd4-a1bf-01662c9d2c01?alt=media)\n*The Family Mediator*\n\nIt's easy to see where this is going. With a Mediator, everything is centralized and scales well. No matter how many people are involved, they don't need to know about each other. The Mediator handles all interactions and keeps them hidden from others. Now, to see how it scales, let's add more people and look at the diagram:\n\n![Mediator Scaling Visualized](https://firebasestorage.googleapis.com/v0/b/markdown-b9f5e.appspot.com/o/AQf2hcbxgSevVmNGPhRZTJg4M7D3%2Fimages%2Fee01ea60-e711-4f2d-8319-a86082267fcf?alt=media)\n*Scaling with the Mediator*\n\nTake a look at **the shape of the arrows**. It's important because it shows that Mediator can hide options from others to communicate backward. For instance, let's say the \`Husband\` instance wants to say something to Mediator, which will then delegate it to \`Lawyer\`. However, if \`Lawyer\` wants to say something to \`Husband\`, the Mediator does not allow that.\n\n> Communication in the Mediator pattern can be **unidirectional** or **bidirectional**, depending on your use case. \n\n## **Mediator** Implementation\n\nLet's stick to the previous example. We're creating an app that allows people to get a faster divorce via a virtual mediation assistant. We'll call our app **"divorce.io"** (‾◡◝). As mentioned before, we want to establish a way to communicate between different modules that represent different people using a Mediator. This will centralize communication without creating direct relationships between the people involved.\n\nFirst of all, let's add **classes** for each person involved.\n\n\`\`\`javascript\n// Interface that describes a human.\ninterface Human {\n  firstName: string;\n  lastName: string;\n  say(message: string): void;\n}\n\nclass Husband implements Human {\n  firstName = "Tom";\n  lastName = "Potato";\n\n  say(message: string) {\n    // Currently nothing...\n  }\n}\n\nclass Wife implements Human {\n  firstName = "Jenny";\n  lastName = "Potato";\n\n  say(message: string) {\n    // Currently nothing...\n  }\n}\n\`\`\`\n\nNothing fancy, our classes allow us to create different people who can say something. We don't have any instances of these classes yet, so let's wait for that. Now, we need to implement a concrete \`Mediator\` class that will manage communication between people.\n\n\`\`\`javascript\n// The author of the propagation command.\ninterface Who extends Pick<Human, "firstName" | "lastName"> {}\n\n// Interface for any Mediator.\ninterface Mediator {\n  propagate(who: Who, message: string): void;\n}\n\n// Utility class with complex logic that prepares documentation.\nclass DivorcePapers {\n  prepare() {\n    // Complex process...\n  }\n}\n\n// Concrete Mediator - in our case, a divorce Mediator.\nclass DivorceMediator implements Mediator {\n  // Utility function to send a response.\n  private answer(message: string) {\n    console.log(message);\n  }\n\n  propagate(who: Who, message: string) {\n    // Based on the author, we propagate different logic.\n    if (who.firstName === "Tom" && message.includes("hate")) {\n      new DivorcePapers().prepare();\n      this.answer(\n        \`Don't worry, \${who.firstName}, the papers will be prepared!\`\n      );\n      return;\n    }\n\n    if (who.firstName === "Jenny") {\n      this.answer("Tom already asked me for the necessary documents.");\n    }\n  }\n}\n\`\`\`\n\nThe \`DivorceMediator\` holds the core logic of the process. It receives communication from each person and responds through the \`answer\` method. However, we need to inject the Mediator instance into each person class to enable calls to the \`propagate\` method from the Mediator.\n\n\`\`\`javascript\n  // This code has been added to "Husband" and "Wife" classes.\n  constructor(private mediator: Mediator) {}\n\n  say(message: string) {\n    this.mediator.propagate(\n      {\n        firstName: this.firstName,\n        lastName: this.lastName\n      },\n      message\n    );\n  }\n\`\`\`\n\nThe last step is to create objects of each class and inject the Mediator instance into the \`Husband\` and \`Wife\`.\n\n\`\`\`javascript\n// This instance handles everything.\nconst dMediator = new DivorceMediator();\n\n// The husband does not know about the wife. There is no direct relationship.\nconst husbando = new Husband(dMediator);\nconst wajfu = new Wife(dMediator);\n\nhusbando.say("I hate her!!!");\n// Logs: "Don't worry, Tom, the papers will be prepared!"\n// In addition, starts papers preparation process.\nwajfu.say("He is ugly!!!");\n// Logs: "Tom already asked me for the necessary documents."\n\`\`\`\n\nThe \`DivorceMediator\` class manages the core logic of the divorce process. Family members send specific messages that the Mediator interprets, triggering actions such as preparing papers and logging via the \`answer\` method. Family members are unaware of who else is involved in the process; everything is hidden from them. They only interact with the injected \`DivorceMediator\` instance through their constructors.\n\nThe beauty of this setup is that we can create any number of process members while keeping the entire process hidden. New handlers can be easily added to the \`DivorceMediator\` class, ensuring scalability. We simply add new code without altering existing contracts or hierarchy.\n\n\`\`\`javascript\nconst son = new Son(dMediator);\nconst lawyer = new Lawyer(dMediator);\nconst daughter = new Daughter(dMediator); // ...etc.\n\`\`\`\n\nHere is the full code:\n\n\`\`\`javascript\n// Interface that describes a human.\ninterface Human {\n  firstName: string;\n  lastName: string;\n  say(message: string): void;\n}\n\n// The data author of the propagation command.\ninterface Who extends Pick<Human, "firstName" | "lastName"> {}\n\n// Interface for any Mediator.\ninterface Mediator {\n  propagate(who: Who, message: string): void;\n}\n\nclass Husband implements Human {\n  firstName = "Tom";\n  lastName = "Potato";\n\n  // Mediator is injected via constructor.\n  constructor(private mediator: Mediator) {}\n\n  // Method calls the propagate method from the Mediator.\n  say(message: string) {\n    this.mediator.propagate(\n      {\n        firstName: this.firstName,\n        lastName: this.lastName\n      },\n      message\n    );\n  }\n}\n\nclass Wife implements Human {\n  firstName = "Jenny";\n  lastName = "Potato";\n\n  constructor(private mediator: Mediator) {}\n\n  say(message: string) {\n    this.mediator.propagate(\n      {\n        firstName: this.firstName,\n        lastName: this.lastName\n      },\n      message\n    );\n  }\n}\n\n// Utility class with complex logic that prepares documentation.\nclass DivorcePapers {\n  prepare() {\n    // Complex process...\n  }\n}\n\n// Concrete Mediator - in our case, a divorce Mediator.\nclass DivorceMediator implements Mediator {\n  // Utility function to send a response.\n  private answer(message: string) {\n    console.log(message);\n  }\n\n  propagate(who: Who, message: string) {\n    // Based on the author, we propagate different logic.\n    if (who.firstName === "Tom" && message.includes("hate")) {\n      new DivorcePapers().prepare();\n      this.answer(\n        \`Don't worry, \${who.firstName}, the papers will be prepared!\`\n      );\n      return;\n    }\n\n    if (who.firstName === "Jenny") {\n      this.answer("Tom already asked me for the necessary documents.");\n    }\n  }\n}\n\n// This instance handles everything.\nconst dMediator = new DivorceMediator();\n\n// The husband does not know about the wife. There is no direct relationship.\nconst husband = new Husband(dMediator);\nconst wife = new Wife(dMediator);\n\nhusband.say("I hate her!!!");\n// Logs: "Don't worry, Tom, the papers will be prepared!"\nwife.say("He is ugly!!!");\n// Logs: "Tom already asked me for the necessary documents."\n\`\`\`\n\n## **Notifications Management** with **Mediator**\n\nTo understand it better, let's implement a notifications management. We'll have both **system** and **user** notifications. User notifications will be sent to all users on the same channel, except the author. System notifications will be sent to every user. The centralized logic will handle different types of notifications.\n\n\`\`\`javascript\n// Shape of a notification object.\ninterface Notification {\n  id: string;\n  createdAt: string;\n  content: string;\n}\n\n// Contract between Mediator and Consumer.\ninterface NotificationsChannel {\n  id: string;\n  type: 'users' | 'system';\n  send(content: string): void;\n  receive(content: string): void;\n}\n\n// General Mediator interface.\ninterface Mediator {\n  propagate(payload: NotificationsChannel, content: string): void;\n  register(channel: NotificationsChannel): void;\n  length(): number;\n}\n\n// Concrete notification implementation for system notifications.\nclass SystemNotificationsChannel implements NotificationsChannel {\n  public type = 'system' as const;\n  public id: string;\n\n  // Mediator is injected via constructor, and upon creation,\n  // the instance is registered using "register".\n  constructor(private mediator: Mediator) {\n    this.mediator.register(this);\n    this.id = this.type + this.mediator.length();\n  }\n\n  // Sends message - internal behavior is unknown to this class.\n  send(content: string) {\n    this.mediator.propagate(this, content);\n  }\n\n  // Receives message and logs it.\n  receive(content: string) {\n    console.log(\`SystemNotificationsChannel log: \` + content);\n  }\n}\n\n// Concrete notification implementation for user notifications.\nclass UsersNotificationsChannel implements NotificationsChannel {\n  public type = 'users' as const;\n  public id: string;\n\n  constructor(private mediator: Mediator) {\n    this.mediator.register(this);\n    this.id = this.type + this.mediator.length();\n  }\n\n  send(content: string) {\n    this.mediator.propagate(this, content);\n  }\n\n  receive(content: string) {\n    console.log(\`UsersNotificationsChannel\${this.id} log: \` + content);\n  }\n}\n\n// Mediator implementation handling all registered channels.\nclass NotificationsMediator implements Mediator {\n  // Holds all registered channels.\n  private channels: NotificationsChannel[] = [];\n\n  // Registers a new channel.\n  register(channel: NotificationsChannel) {\n    this.channels.push(channel);\n  }\n\n  // Propagates a message, handling differently based on the channel type.\n  propagate(payload: NotificationsChannel, content: Notification['content']) {\n    if (payload.type === 'users') {\n      this.channels.forEach((channel) => {\n        if (channel.type === payload.type && channel.id !== payload.id) {\n          channel.receive(content);\n        }\n      });\n    } else {\n      this.channels.forEach((channel) => {\n        if (channel.type === 'users') {\n          channel.receive(content);\n        }\n      });\n    }\n  }\n\n  // Returns the number of registered channels.\n  length(): number {\n    return this.channels.length;\n  }\n}\n\n// Usage example\nconst mediator = new NotificationsMediator();\n\nconst userChannel1 = new UsersNotificationsChannel(mediator);\nconst userChannel2 = new UsersNotificationsChannel(mediator);\nconst systemChannel1 = new SystemNotificationsChannel(mediator);\n\nuserChannel1.send(\`Hi all\`);\nuserChannel2.send(\`Hi bro\`);\nsystemChannel1.send(\`Not allowed notification use detected. Both banned\`);\n\n// The result is logged as:\n// UsersNotificationsChannelusers2 log: Hi all\n// UsersNotificationsChannelusers1 log: Hi bro\n// UsersNotificationsChannelusers1 log: Not allowed notification use detected. Both banned\n// UsersNotificationsChannelusers2 log: Not allowed notification use detected. Both banned\n\`\`\`\n\nThe key point is bidirectional communication between the **Mediator** and **Consumer**, where each can call the other's \`public\` methods. This is demonstrated in the \`propagate\` method, which invokes \`channel.receive\`, and in the channels implementation, where \`mediator.register\` is called.\n\nWhen a \`UsersNotificationsChannel\` is created with \`new UsersNotificationsChannel(mediator)\`, it invokes \`register\`, storing the instance in the \`channels\` array within \`NotificationsMediator\`. During \`propagate\`, the array is iterated to call \`receive\` and share information with other instances, ensuring the sender is excluded.\n\nYou could also implement this using the [Observable](https://4markdown.com/observer-pattern-in-typescript/) pattern, which is valid. There are multiple approaches to achieve this, with the Mediator pattern being a scalable choice if implemented carefully.\n\n> The \`NotificationsMediator\` facilitates **bidirectional** communication, allowing both the module and its consumers to invoke methods and access \`public\` properties. In contrast, the earlier example with the family was **unidirectional**.\n\n## Too Big Mediators - **God Classes** Issue\n\n> A **God Class** has too many responsibilities and knows too much about other parts of the system, leading to tightly coupled and hard-to-maintain code.\n\nThe **Mediator** pattern reduces coupling, but it can get complicated if misused. Incorrect implementation often leads to nightmare.\n\n\`\`\`javascript\nclass PaymentMediator {\n  propagate() {\n    // Too much logic here...\n  }\n}\n\`\`\`\n\nTo avoid this, we may use the **Strategy** pattern to delegate tasks:\n\n\`\`\`javascript\n// Strategy base.\nclass PaymentStrategy {\n  pay(amount) {\n    throw new Error("This method should be overridden!");\n  }\n}\n\n// Concrete strategies.\nclass CreditCardPayment extends PaymentStrategy {\n  pay(amount) {\n    console.log(\`Paid \${amount} using Credit Card.\`);\n  }\n}\n\nclass PayPalPayment extends PaymentStrategy {\n  pay(amount) {\n    console.log(\`Paid \${amount} using PayPal.\`);\n  }\n}\n\nclass PaymentMediator {\n  propagate(amount) {\n    // Delegate work to strategy classes.\n    if (condition) {\n      new CreditCardPayment().pay(amount);\n    } else {\n      new PayPalPayment().pay(amount);\n    }\n  }\n}\n\`\`\`\n\n## Other **Use Cases** Ideas\n\n1. **Message Brokers**: Delegate certain information about system events to different microservices.\n2. **Chat**: Delegate messages and interaction highlights to different users based on conditions.\n3. **Managing Distributed System Logic**: There may be one bus (Mediator) that maintains the overarching process between smaller subsystems within a larger system.\n4. **State Manager for Frontend**.\n5. **Divorce App** (～￣▽￣)～.\n\n## Summary\n\nNow you see how the Mediator pattern solves common coupling and dependency management problems. Instead of an everyone-to-everyone relationship, we've created a one-to-many relationship. Everything is centralized. The Mediator can be great for many situations, but it should never be forced. You should first identify the problem, as we did with the complex relationships between family members.\n\nThe Mediator saves a lot of time related to maintaining and rewriting complex relationships. Additionally, it often allows developers to add new code without changing existing code, which is the best possible outcome. Each code change introduces risk, so minimizing changes to existing code is beneficial.\n\nIt's important to avoid creating overly large Mediators, as they can become hard to maintain. Key points to remember from this article:\n\n1. The Mediator is a behavioral design pattern.\n2. It reduces coupling and simplifies dependency management.\n3. It transforms relationships from many-to-many to one-to-many.\n4. Instances of Mediator should be injected into other classes/modules, not initialized by them.\n5. The implementation of any design pattern should be considered carefully and should occur naturally, rather than being forced.\n6. The **God Class** problem may occur (you need to be careful).`,
      cdate: now.toISOString(),
      mdate: now.toISOString(),
      visibility: `public`,
      author: null,
      rating: {
        bad: 1,
        ugly: 2,
        good: 1,
        decent: 0,
        perfect: 1,
      },
    },
  ],
};

const getPublicDocResponse: { result: PublicDocumentDto } = {
  result: getDocsResponse.result[0],
};

const getUserProfileResponse: { result: UserProfileDto } = {
  result: {
    id: `e9799f7b-013e-4231-88fe-e2072514f96a`,
    displayNameSlug: null,
    cdate: `2025-01-22T13:43:25.337Z`,
    mdate: `2025-01-22T13:43:25.337Z`,
    avatar: null,
    displayName: null,
    bio: null,
    blogUrl: null,
    fbUrl: null,
    githubUrl: null,
    twitterUrl: null,
    linkedInUrl: null,
  },
};

const getYourAccountResponse: { result: API4MarkdownDto<`getYourAccount`> } = {
  result: {
    trusted: true,
    balance: {
      tokens: 50,
      refillStatus: `initialized`,
    },
  },
};

describe(`Docs display works when`, () => {
  const given = gherkin({
    ...BASE_COMMANDS,
    "I preview document": (title: string) => {
      cy.get(`strong`).contains(title).click();
    },
    "I see document preview correctly displayed": () => {
      cy.get(`.prose > h1, .prose > h2`).each((h) => {
        cy.contains(h.text()).scrollIntoView();
        given(`System takes picture`, `document-preview-heading-${h.text()}`);
      });
    },
  });

  it(`documents are grouped by dates`, () => {
    given(`System mocks api`, {
      endpoint: `getYourDocuments`,
      code: 200,
      response: getDocsResponse,
    })
      .and(`System mocks api`, {
        endpoint: `getYourAccount`,
        code: 200,
        response: getYourAccountResponse,
      })
      .and(`System mocks api`, {
        endpoint: `getAccessibleDocument`,
        code: 200,
        response: getPublicDocResponse,
      })
      .and(`System mocks api`, {
        endpoint: `getYourUserProfile`,
        code: 200,
        response: getUserProfileResponse,
      })
      .and(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I log in`)
      .and(`I wait for api`, `getYourAccount`, 200)
      .and(`I set white theme`)
      .and(`I see not disabled button`, [`Your documents`])
      .and(`I see text`, [
        getYourAccountResponse.result.balance.tokens.toString(),
      ])
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [getPublicDocResponse.result.name])
      .when(`I preview document`, getPublicDocResponse.result.name)
      .then(`I see disabled button`, [`Save changes`])
      .and(`I wait`, 1000)
      .and(`System takes picture`, `document-in-creator`)
      .when(`I click button`, [`More document options`, `Document preview`])
      .then(`I not see button`, [`Your documents`])
      .and(`I see document preview correctly displayed`);
  });
});
