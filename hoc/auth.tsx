"use client";

const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    console.log("HOC Applied");
    return <Component {...props} />;
  };
};

export default withAuth;
