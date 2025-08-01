import React, { useRef, useState } from "react";
import "./Accordian.css";

const Accordian = () => {
  const user = [
    {
      question: "What is Link Hangouts?",
      answer:
        "Link Hangouts is a lifestyle and events brand based in Lagos, Nigeria. We curate exclusive experiences—from beach house parties to premium social hangouts—that bring people together to connect, vibe, and make unforgettable memories.",
    },
    {
      question: "How do I get tickets to your events?",
      answer:
        "Tickets can be purchased directly on our website. Simply go to the Events page, select the event you're interested in, and follow the secure checkout process.",
    },
    {
      question: "Are tickets refundable or transferable?",
      answer:
        "All ticket sales are final and non-refundable unless the event is officially canceled. Tickets are also non-transferable unless pre-approved by our team.",
    },
    {
      question: "What's the dress code?",
      answer:
        "Some events have specific themes or dress codes (e.g. all-bikini, beachwear, neon, all-white). Check the event description or flyer for details.",
    },
    {
      question: "How will I know the venue?",
      answer:
        "Venue details are shared privately after ticket purchase, usually by email or SMS. For boat-access venues, you'll get dock/boarding instructions ahead of time.",
    },
    {
      question: "Can I bring my friends?",
      answer:
        "Yes! Just ensure each person has a valid ticket. You can purchase for your group in one order.",
    },
    {
      question: "Will I be on camera?",
      answer:
        "Our events are often filmed or photographed. By attending, you consent to potentially being featured in promotional content. If you'd rather not be shown, please notify our team on-site.",
    },
    {
      question: "How can I stay in the loop?",
      answer:
        "Follow us on social media and subscribe to our newsletter for early-bird tickets, exclusive invites, and insider updates.",
    },
  ];

  const faqs = [
    {
      question: "Can I use Link Hangouts to sell tickets for my own event?",
      answer:
        "Yes! Link Hangouts is not just for our in-house events. As an external organizer, you can: create an Organizer Account, set up and publish your own event, promote it and sell tickets directly on our platform.",
    },
    {
      question: "Can I host free events?",
      answer:
        "Yes. You're free to create and publish free-entry events on the platform.",
    },
    {
      question: "How much does Link Hangouts charge on ticket sales?",
      answer: "We charge 8% of each paid ticket sold on the platform.",
    },
    {
      question: "Is there a withdrawal fee?",
      answer: "Yes. There's a ₦100 flat fee per withdrawal transaction.",
    },
    {
      question: "How often can I withdraw my earnings?",
      answer:
        "You can withdraw on fridays and mondays after ticket sales begin. This allows time for proper verification and accurate payouts.",
    },
    {
      question: "How do I become an event organizer on Link Hangouts?",
      answer:
        "Sign up for an organizer account on our website, create and publish your event (include details, media, ticketing options), share your event link and start selling!",
    },
    {
      question: "Do I need approval to post an event?",
      answer:
        "Events go through a quick internal review. You'll get a notification once approved, typically within 24 hours.",
    },
    {
      question: "What kinds of events can I host?",
      answer:
        "You can host parties, mixers, shows, beach hangouts, boat rides, and more—as long as they align with our community guidelines.",
    },
    {
      question: "Can I track ticket sales in real-time?",
      answer:
        "Yes. You'll get access to a dashboard with live sales data, attendee info, and earnings.",
    },
    {
      question: "Who do I contact for support?",
      answer:
        "Email us at [Your Email Address] or use the Contact Us form on the website.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(-1);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <div className="container">
      <div className="app" data-aos="fade-up">
        <h1 className="font-size-30">Frequently asked questions (FAQs)</h1>
        <p style={{ fontSize: "11px" }}>Last updated 9th July 2025</p>

        <div className="acorddion-wrapper">
          <h2 style={{ textAlign: "center" }} className="font-size-25">
            For event Guests
          </h2>
          {user.map((faq, index) => (
            <Accordiontem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              toggleAccordion={toggleAccordion}
            />
          ))}
        </div>

        <br />
        <br />

        <div style={{ marginTop: '2em' }}  className="acorddion-wrapper">
          <h2 style={{ textAlign: "center" }} className="font-size-25">
            For event Organizers
          </h2>
          {faqs.map((faq, index) => (
            <Accordiontem
              key={user.length + index}
              index={user.length + index}
              question={faq.question}
              answer={faq.answer}
              isOpen={user.length + index === openIndex}
              toggleAccordion={toggleAccordion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Accordiontem = ({ question, answer, index, isOpen, toggleAccordion }) => {
  const contentref = useRef();

  return (
    <div className="according-items" data-aos="fade-up">
      <div
        className={`accordion-item ${isOpen ? "open" : "closed"}`}
        onClick={() => toggleAccordion(index)}
      >
        <div className="inner_item">
          <div className="accordion-header">
            <div className="accordion-question">{question}</div>
            <div className={`accordion-icon ${isOpen ? "open" : "closed"}`}>
              <div className="acordion-img" />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={contentref}
        className="accordion-answer"
        style={
          isOpen
            ? { height: contentref.current?.scrollHeight }
            : { height: "0px" }
        }
      >
        <div className="inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Accordian;
