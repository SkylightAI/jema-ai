import React, { useState } from "react";
import InputComponent from "./InputComponent";
import OutputComponent from "./OutputComponent";
import { Template } from "../constants/templates";
import {TemplateInput} from "../../constants/templates";
import toast, { Toaster } from 'react-hot-toast';
import { signIn, signOut } from "next-auth/react";
import Link from 'next/link';
type InputsData = {
    [key: string]: string;
};
const createInstruction = (inputs: TemplateInput[], inputsData: InputsData): string => {
    return inputs.map((input) => `${input.label}: ${inputsData[input.id]}`).join("\n");
};

// @ts-ignore
const InputOutputComponent = ({ template, user, membership, product, plan }) => {
  const [output, setOutput] = useState("");

  const handleClearOutput = () => {
    setOutput("");
  };
  console.log("INPUT OUTPUT", membership)
  const generateOutputHandler = async (
    template: Template,
    inputsData: { [key: string]: string }
  ) => {
    if(!user){
        toast.custom(
            <div className="bg-blue-800 p-5 rounded-xl shadow-lg flex flex-col items-center space-y-4 transition-all duration-300 ease-in-out hover:shadow-xl">
                <p className="text-lg font-semibold text-blue-200">
                    Please login to continue.
                </p>
                <a
                    href="#"
                    onClick={() => signIn("skylightai")}
                    className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                >
                    Login with Skylight AI ✨
                </a>
            </div>,
            {
                id: 'window-ai-not-detected',
                duration: 10000,
            },
        );
        return;
    }

    // if the window object does not have the property .ai then the extension is not installed
    if(!window.ai){
        toast.custom(
            <div className="bg-indigo-800 p-5 rounded-xl shadow-lg flex flex-col items-center space-y-4 transition-all duration-300 ease-in-out hover:shadow-xl">
              <p className="text-lg font-semibold text-indigo-200">
                Install the window.ai extension.
              </p>
              <a
                href="https://windowai.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-400 transition-colors duration-300 ease-in-out"
              >
                Visit windowai.io
              </a>
            </div>,
            {
              id: 'window-ai-not-detected',
              duration: 10000,
            },
          );
          return;
    }
    const instruction = createInstruction(template.inputs, inputsData);
    const mainGoal = template.command;
    const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Your task is: "${mainGoal}".\n\nHere are the details:\n${instruction}.
        Please suggest 3 outputs. number them 1,2,3` },
    ];
    try{
        const [ response ] = await window.ai.generateText(
            {
                messages,
            },)
        const reply = response.message.content;
        setOutput(reply);
    } catch (e) {
        toast.error("Something went wrong. Please try again.")
        setOutput("")
    }
    
  };
  return (
    <div className="flex flex-col lg:flex-row w-full h-full">

      <Toaster/>
      <InputComponent
        template={template}
        user={user}
        membership={membership}
        generateOutput={generateOutputHandler}
      />
      <OutputComponent
        onClearOutput={handleClearOutput}
        generatedOutput={output}
      />
    </div>
  );
};

export default InputOutputComponent;

// export { default as getServerSideProps } from "@/lib/get-user-server-side";
