import { useState, useEffect } from "react";

const usePostRequest = ({writtenReq , url}) => {
  const [postData, setPostData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const requestBody = JSON.stringify({
          meddelande: writtenReq
        });

        const response = await fetch('https://fnattimagev2-yrgp6cugha-ew.a.run.app/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error('Failed to send magic');
        }

        const data = await response.json();

          setPostData(data.meddelande);
          setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (writtenReq) {
      fetchData();
    }
  }, [writtenReq]);

  return { loading, postData, error };
};

export default usePostRequest;
