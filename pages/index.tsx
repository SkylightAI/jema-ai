import React from 'react';
import Layout from '../components/Layout';
import CardGrid from "../components/CardGrid";
import {TEMPLATES} from "../constants/templates";
import { NextPage } from "next";
import { UserProps } from "@/lib/get-user-server-side";
import Link from "next/link";
const Page: NextPage<UserProps> = ({ user }) => {

    return (
        <Layout title="">
            <h1 className="text-4xl font-bold mt-10 ml-10">
                Welcome to <span className="text-blue-600">Jema.ai</span> x <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://skylightai.io?utm_source=nextjs-template"
                className="text-blue-600"
              >
                Skylight AI ✨{user ? `, ${user.username}!` : `!`}
              </Link>
                
            </h1>
            {/* <div className='ml-10 mt-4 w-10/12'>
  <a href="https://skylightai.io" target="_blank" className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center">
    <span>Check out more apps on Skylight AI ✨</span>
  </a>
</div> */}

            <h2 className="text-2xl font-light mt-5 ml-10">
                Create amazing <strong className="text-blue-600">blog posts, marketing copy, SEO content</strong> and a
                lot more with ChatGPT.
            </h2>
            <CardGrid cards={TEMPLATES}/>
        </Layout>
    );
};

export default Page;

export { default as getServerSideProps } from "@/lib/get-user-server-side";