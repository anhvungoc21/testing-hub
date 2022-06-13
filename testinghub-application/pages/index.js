import Layout from "../components/Layout";
import Header from "../components/Header";
import Footer2 from "../components/Footer2";

const Index = () => {
  return (
    <div>
      <Layout pageTitle="Landing Page">
        <Header />
        <div className="center">
          <br></br>
          <h1>How it began...</h1>
          <hr></hr>
          <h3>
            We got tired of the work behind 'test-driven' decisions in email.{" "}
          </h3>
          <p>
            Too many hours in Klaviyo copying results into a 3rd party
            calculator just to find out your subject line test still isn’t
            significant.
          </p>
          <br></br>
          <h3>Sound familiar?</h3>
          <p>Turns out, everyone we talked to had the same issue.</p>
          <br></br>

          <h3>Brands, agencies, freelancers - didn’t matter.</h3>
          <p>
            <strong>Everyone wants</strong> and <strong>expects</strong>{" "}
            data-driven decision making in this world, but nobody had a way to
            do this efficiently for email.<br></br>
            Knowing that <strong>testing</strong> was the <strong>key</strong>{" "}
            to optimization, we set out to build a tool to eliminate the hassle
            of testing in email.{" "}
          </p>

          <hr></hr>
          <h1>Our Solution?</h1>
          <h2>
            <strong>TestingHub. </strong>
          </h2>
          <h4>
            It's your one stop shop for A/B tests. Routine checks put on
            autopilot, giving your more time to take your email to the next
            level.
          </h4>

          <p>
            You can kiss goodbye to your favorite significance calculator and
            the ongoing to-do list of ‘Check subject line tests for Abandoned
            Checkout.’ <br></br>
            Here’s your key to data-driven decisions.{" "}
          </p>
          <br></br>
          <h3>What To Expect</h3>
          <li>0 hours spent checking A/B tests🏝</li>
          <li>Easy, real time updates of your subject line tests📊</li>
          <li>Testing & decisions based on statistics, not gut feelings🔍</li>
          <hr></hr>

          <h2>Did we get your interest?</h2>
          <p>
            We're still putting the finishing touches on TestingHub, but we'd
            love to get in touch. <br></br>
            Drop your email below and we'll keep you posted on updates and our
            release🔥
          </p>
        </div>

        <hr></hr>

        <Footer2 />
      </Layout>
    </div>
  );
};

export default Index;
