import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../db";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export default function Question() {
  function resetInputs() {
    setInputs({
      question: "",
      answer: "",
    });
  }

  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const { id } = useParams();

  const subject = useLiveQuery(async () => {
    if (id) {
      const sub = await db.subjects.get(parseInt(id));
      return sub;
    }
  }, [id]);

  const questions = useLiveQuery(async () => {
    if (subject) {
      const questions = await db.questions
        .where("subject")
        .equals(subject.name)
        .toArray();
      return questions;
    }
  }, [subject]);

  const [inputs, setInputs] = useState({
    question: "",
    answer: "",
  });

  function handleChange(e) {
    e.persist();
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      ...inputs,
      subject: subject.name,
    };
    if (inputs.question != "")
      db.questions
        ?.add(data)
        .then((res) => {
          Swal.fire(
            "Success",
            `Question Created successfully with id ${res}`,
            "success"
          );
          resetInputs();
        })
        .catch((err) => {
          Swal.fire("Error", err, "error");
        });
  }

  function deleteItem(id) {
    db.questions
      .delete(id)
      .then((res) => {
        Swal.fire("Success", "Question Deleted successfully", "success");
      })
      .catch((err) => {
        Swal.fire("Error", err, "error");
      });
  }

  return (
    <div className="max-w-6xl mx-auto pt-16">
      <Link to="/">Home</Link>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="p-2"
          type="text"
          name="question"
          placeholder="question"
          onChange={handleChange}
          value={inputs.question}
        />
        <textarea
          className="p-2"
          type="text"
          name="answer"
          placeholder="answer"
          onChange={handleChange}
          value={inputs.answer}
        />
        <button type="submit" className="">
          Create
        </button>
      </form>
      {questions?.map((question) => (
        <div key={question.id}>
          <Accordion open={open === question.id}>
            <AccordionHeader onClick={() => handleOpen(question.id)}>
              {question.question}
            </AccordionHeader>
            <AccordionBody style={{ whiteSpace: "pre-wrap" }}>
              {question.answer}
            </AccordionBody>
          </Accordion>
          <button onClick={() => deleteItem(question.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
