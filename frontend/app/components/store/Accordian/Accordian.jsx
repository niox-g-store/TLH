import React, { useRef, useState } from "react";
import "./Accordian.css";

const Accordian = () => {
  const faqs = [
    {
      question: "What is Lorem Ipsum?",
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
    },
    {
      question: "Why do we use it?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. n",
    },
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "How to install React?",
      answer: "You can install React using npm or yarn.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(-1);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };
  return (
    <>
      <div className="container">
        <div className="app" data-aos="fade-up">
          <h1>FAQ</h1>
          <div className="acorddion-wrapper">
            {faqs.map((faq, index) => (
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
        </div>
      </div>
    </>
  );
};

const Accordiontem = ({ question, answer, index, isOpen, toggleAccordion }) => {
  const contentref = useRef();

  return (
    <>
      <div className="according-items" data-aos="fade-up">
        <div
          className={`accordion-item ${isOpen ? "open" : "closed"}`}
          onClick={() => toggleAccordion(index)}>
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
              ? { height: contentref.current.scrollHeight }
              : { height: "0px" }
          }>
          <div className="inner">
            <p>{answer}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accordian;
