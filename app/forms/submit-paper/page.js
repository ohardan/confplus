"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { createPaperAction, readAffiliationsAction } from "@/app/actions";

export default function SubmitPaper() {
  const [titleFoucsed, setTitleFocused] = useState(false);
  const [authorsList, setAuthorsList] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      affiliationId: "",
    },
  ]);
  const presenterIdx = useRef();
  const [affiliations, setAffiliations] = useState([]);
  const pdfInput = useRef();
  const pdfText = useRef();

  const [creatorId, setCreatorId] = useState("");
  const [authorsCount, setAuthorsCount] = useState(0);
  useEffect(() => {
    setCreatorId(JSON.parse(localStorage.getItem("user"))?.userId);
    readAffiliationsAction().then((result) => setAffiliations(result.payload));
  }, []);

  useEffect(() => setAuthorsCount(authorsList.length), [authorsList]);

  return (
    <main className="grid place-items-center p-4">
      <form
        action={createPaperAction}
        className="flex flex-col text-lg gap-6 p-10 bg-cp-ghost-white lg:grid lg:grid-cols-4">
        <input
          hidden
          readOnly
          name="creatorId"
          value={creatorId}
        />
        <input
          hidden
          readOnly
          name="authorsCount"
          value={authorsCount}
        />
        <div className="flex flex-col gap-4 border-b-2 pb-4 col-span-1 lg:border-b-0">
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className={`relative top-8 ${
                titleFoucsed ? "isfocused text-black" : "text-gray-500"
              }`}>
              Paper's Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="w-[250px] outline-transparent bg-cp-ghost-white p-1 border-b-[3px]"
              onFocus={() => setTitleFocused(true)}
              onBlur={(e) => {
                if (!e.target.value) setTitleFocused(false);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="abstract">Abstract</label>
            <textarea
              name="abstract"
              required
              placeholder="write the abstract of the paper..."
              id="abstract"
              cols="10"
              rows="10"
              className="text-base"
            />
          </div>

          <div className="flex flex-col gap-1 justify-center items-center">
            <input
              type="file"
              ref={pdfInput}
              name="paperPDF"
              accept="application/pdf"
              required
              hidden
              onChange={(e) => {
                if (e.target.files[0]) {
                  pdfText.current.innerText = e.target.files[0].name;
                } else {
                  pdfText.current.innerText = "No File Chosen";
                }
              }}
            />
            <button
              type="button"
              className="my-btn"
              onClick={() => pdfInput.current.click()}>
              Upload The Paper
            </button>
            <p ref={pdfText}>No File Chosen</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 col-span-3">
          <h2 className="text-xl font-semibold">Authors</h2>
          <div className="ram-grid lg:h-[400px] lg:overflow-y-scroll">
            {authorsList.map((author, index) => (
              <AuthorCard
                key={index}
                index={index}
                author={author}
                setAuthorsList={setAuthorsList}
                affiliations={affiliations}
              />
            ))}
          </div>
          <button
            type="button"
            className="my-btn w-[150px]"
            onClick={() => {
              setAuthorsList((curr) => [
                ...curr,
                {
                  firstName: "",
                  lastName: "",
                  email: "",
                  affiliationId: "",
                },
              ]);
            }}>
            Add Author
          </button>
          {authorsList.length ? (
            <div className="flex flex-col gap-1 text-base items-center">
              <label htmlFor="presenter">Choose A Presenter</label>
              <select
                ref={presenterIdx}
                id="presenter"
                name="presenter"
                defaultValue={0}
                required
                className="w-[100px] px-1 outline-transparent bg-cp-ghost-white border-[2px]">
                {authorsList.map((_, index) => (
                  <option
                    key={index}
                    value={index}>
                    Author {index + 1}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex justify-between col-span-2 lg:col-span-4 place-items-end">
          <Link
            href="/pages/my-papers"
            className="flex items-center px-2 h-[40px] my-btn">
            <LeftOutlined />
          </Link>
          <input
            type="submit"
            value="Submit"
            className="cursor-pointer text-lg h-[40px] my-btn"
          />
        </div>
      </form>
    </main>
  );
}

function AuthorCard({ index, author, setAuthorsList, affiliations }) {
  const textInput =
    "bg-cp-ghost-white px-1 border-[2px] outline-transparent w-[200px]";
  return (
    <div className="grid place-items-center gap-1 bg-gray-100 rounded-md text-base w-[250px] p-2">
      <h3 className="text-lg font-medium">Author {index + 1}</h3>

      <label htmlFor="fname">First Name</label>
      <input
        type="text"
        id="fname"
        name={"firstName" + index}
        required
        className={textInput}
        value={author.firstName}
        onChange={(e) => {
          setAuthorsList((curr) => {
            curr[index].firstName = e.target.value;
            return [...curr];
          });
        }}
      />

      <label htmlFor="lname">Last Name</label>
      <input
        type="text"
        id="lname"
        name={"lastName" + index}
        required
        className={textInput}
        value={author.lastName}
        onChange={(e) => {
          setAuthorsList((curr) => {
            curr[index].lastName = e.target.value;
            return [...curr];
          });
        }}
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name={"email" + index}
        required
        className={`${textInput} valid:border-green-700`}
        value={author.email}
        onChange={(e) => {
          setAuthorsList((curr) => {
            curr[index].email = e.target.value;
            return [...curr];
          });
        }}
      />

      <label htmlFor="affiliation">Affiliation</label>
      <select
        name={"affiliationId" + index}
        id="affiliation"
        required
        className="w-[200px] px-1 overflow-ellipsis outline-transparent bg-cp-ghost-white border-[2px]"
        defaultValue=""
        onChange={(e) => {
          setAuthorsList((curr) => {
            curr[index].affiliationId = e.target.value;
            return [...curr];
          });
        }}>
        <option
          disabled
          value="">
          Choose An Institution
        </option>
        {affiliations.map((affiliation, index) => (
          <option
            value={affiliation.institutionId}
            key={index}>
            {affiliation.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="grid place-items-center hover:text-white hover:bg-red-500 rounded-full w-[30px] h-[30px] transition-colors duration-100"
        onClick={() =>
          setAuthorsList((curr) => curr.filter((_, i) => i !== index))
        }>
        <DeleteOutlined />
      </button>
    </div>
  );
}
