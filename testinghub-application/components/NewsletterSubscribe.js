import MailchimpSubscribe from "react-mailchimp-subscribe";
import NewsLetterForm from "./NewsLetterForm";

const NewsletterSubscribe = () => {
  const MAILCHIMP_URL =
    "https://get-testing-hub.us14.list-manage.com/subscribe/post?u=9ad8fd3c79888219ef233b933&amp;id=a6eaeb060d";

  return (
    <MailchimpSubscribe
      url={MAILCHIMP_URL}
      render={(props) => {
        const { subscribe, status, message } = props || {};
        return (
          <NewsLetterForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        );
      }}
    />
  );
};

export default NewsletterSubscribe;
