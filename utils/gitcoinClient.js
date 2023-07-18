export const getCreditScore = async (ethAddress) => {
    const apiKey = process.env.GITCOIN_API_KEY;  
    const requestUrl = `https://api.scorer.gitcoin.co/registry/submit-passport`;
    const scorer_id = "1641"
  
    const requestBody = JSON.stringify({
      "address": ethAddress,
      "scorer_id": scorer_id
    });
  
    try {
      console.log("posting...to gitcoin");
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': `${apiKey}`,
        },
        body: requestBody,
      });
  
      // if (!response.ok) {
      //   if (response.status === 422) {
      //     alert("You have insufficient on-chain data to have a credit-score. Try connecting a wallet with more on-chain activity, then try again.");
      //   } else {
      //     throw new Error('Failed to fetch credit score from Gitcoin:');
      //   }
      // }
  
      const data = await response.json();
      console.log('data', data);
      return data;
      
    } catch (error) {
      console.error('Failed to fetch credit score from Gitcoin:', error);
      throw error;
    }

  };
