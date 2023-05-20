import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from "../../components/Layout";
import {TEMPLATES} from "../../constants/templates";
import InputOutputComponent from "../../components/InputOutputComponent";
import getSdk from "@/lib/get-user-sdk/pages";
import { User } from "@whop-sdk/core";
import { Membership, Plan, Product } from "@whop-sdk/core";
import findProduct from "@/lib/has-product";
import ServerSDK from "@/lib/sdk";
import { GetServerSideProps, NextPage } from "next";

/**
 * a list of product IDs that are allowed to view this page
 */
const ALLOWED_PRODUCT: string = process.env.NEXT_PUBLIC_REQUIRED_PRODUCT || "";
/**
 * a plan that is recommended to buy if the user does not
 * own a required product
 */
const RECOMMENDED_PLAN = process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "";

export type UserProps = {
  user: User | null;
};
type ProductGatedProps =
| {
    user: User | null;
} | {
      user: User;
      membership: Membership;
      product: null;
      plan: null;
    }
  | {
    user: User;
      membership: null;
      product: Product;
      plan: Plan;
    };

const TemplatePage: NextPage<ProductGatedProps> = ({ user, membership, product, plan }) => {
    const router = useRouter();
    const { id } = router.query;
    const [template, setTemplate] = useState(null);
    useEffect(() => {
        if (id) {
            const selectedTemplate = TEMPLATES.find((t) => t.id === id);
            // @ts-ignore
            setTemplate(selectedTemplate);
        }
    }, [id]);

    if (!template) {
        return <div>Loading...</div>;
    }

    return (
        // @ts-ignore
        <Layout title="">
            <InputOutputComponent template={template} user={user} membership={membership} product={product} plan={plan}/>
        </Layout>

    );
};

export default TemplatePage;


export const getServerSideProps: GetServerSideProps<
  ProductGatedProps
> = async ({ req, res }) => {
  const { sdk } = await getSdk(req, res);
  const user = await sdk?.retrieveUsersProfile({});
  if (!user || !sdk)
    return {
        props: {
            user: user || null,
            },
    };
  const membership = await findProduct(sdk, ALLOWED_PRODUCT);
  console.log("MEMBERSHIP SERVER", membership)
  if (membership)
    return {
      props: {
        user,
        membership,
        product: null,
        plan: null,
      },
    };
  else {
    const [product, plan] = await Promise.all([
      ServerSDK.products.retrieveProduct({
        id: ALLOWED_PRODUCT,
      }),
      ServerSDK.plans.retrievePlan({
        id: RECOMMENDED_PLAN,
      }),
    ]);
    return {
      props: {
        user,
        membership: null,
        product,
        plan,
      },
    };
  }
};