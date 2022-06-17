import Layout from "../components/Layout";
import Header from "../components/Header";
import Home from "./home";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div>
      <Layout pageTitle="Landing Page">
        <Header />
        <Home />
        <Footer />
      </Layout>
    </div>
  );
};

export default Index;
