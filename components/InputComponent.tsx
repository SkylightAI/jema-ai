import React, {useState} from 'react';
import TemplateHeader from "./TemplateHeader";
import {Template} from "../constants/templates";
import {signIn} from "next-auth/react";
import { usePurchaseLink } from "@/lib/get-purchase-link";
import { signOut } from "next-auth/react";
interface InputComponentProps {
    generateOutput: (template: Template, inputsData: { [key: string]: string }) => void;
    user: any;
    membership: any;
    template: Template;
}


const renderInputField = (
    input: { id: any; label: any; placeholder?: string; type?: "text" | "textarea" | "select"; options?: string[] | undefined },
    value: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) => {
    if (input.type === "textarea") {
        return (
            <textarea
                id={input.id}
                value={value}
                onChange={handleChange}
                className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={input.placeholder}
                rows={4}
                maxLength={800}
            />
        );
    } else if (input.type === "text") {
        return (
            <input
                maxLength={300}
                type="text"
                id={input.id}
                value={value}
                onChange={handleChange}
                className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={input.placeholder}
            />
        );
    } else {
        return <></>

    }
    return null;
};

const InputComponent: React.FC<InputComponentProps> = ({
                                                          template,
                                                          user,
                                                          membership,
                                                          generateOutput,
                                                      }) => {
    const [isLoading, setIsLoading] = useState(false);
    const link = usePurchaseLink(process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "");
    const [inputsData, setInputsData] = useState<{ [key: string]: string }>({});
    const handleInputChange = (e: any) => {
        setInputsData({...inputsData, [e.target.id]: e.target.value});
    };
    const handleClearInputs = () => {
        const clearedInputsData = { ...inputsData };
        Object.keys(clearedInputsData).forEach((key) => {
            clearedInputsData[key] = '';
        });
        setInputsData(clearedInputsData);
    };
    console.log(membership)

    const isFirstInputEmpty = () => {
        if (template.inputs.length > 0) {
            const firstInputId = template.inputs[0].id;
            return !inputsData[firstInputId];
        }
        return false;
    };
    return (
        <div className="w-full lg:w-1/2 bg-gray-50 border-r flex flex-col">
            <TemplateHeader icon={template.icon } title={template.title} description={template.description}/>
            <div
  className={`flex flex-col p-4 flex-grow`}
>
    {/* Login button if not signed in, else welcome message */}
    {user ? "Welcome, " + user.username + "!" : <div className='w-10/12'>
        <a href="#" onClick={() => signIn("skylightai")}
              className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center">
                {/* "Please login with Skylight AI ✨" */}
                <span>Please Login with Skylight AI ✨</span>
            </a>
        </div>}
    {(user && !membership) ? <div className='w-10/12'>
        <a href={link}
                className="mt-1 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center">
                <span>Please Get Access on Skylight AI ✨</span>
            </a>
        </div> : null}
        <div className={`${(user && membership) ? '' : 'filter blur-[1px] pointer-events-none'}`}>
  {template.inputs.map((input) => (
    <label htmlFor={input.id} className="block mt-4" key={input.id}>
      {input.label}
      {renderInputField(input, inputsData[input.id] || '', handleInputChange)}
    </label>
  ))}
  </div>
  
</div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div>
                <button
                    onClick={handleClearInputs}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                >
                    Clear inputs
                </button>
                {user ? 
                <button
                    onClick={() => signOut()}
                    className="ml-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                >
                    Log Out
                </button> : null}
                </div>
                <button
                    onClick={async () => {
                        setIsLoading(true);
                        await generateOutput(template, inputsData);
                        setIsLoading(false);
                    }}
                    className={`px-4 py-2 text-white bg-gradient-to-r from-purple-400 to-blue-400 rounded-md hover:from-purple-300 hover:to-blue-300 relative ${isLoading ? 'opacity-50' : ''}`}
                    disabled={isLoading || isFirstInputEmpty()}
                >
                    {isLoading && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-t-2 border-purple-500 border-solid rounded-full animate-spin"></div>
                        </div>
                    )}
                    <span className={`${isLoading ? 'invisible' : ''}`}>Generate</span>
                </button>


            </div>
        </div>
    );
}
export default InputComponent;
