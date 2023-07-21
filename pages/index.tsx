import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import { Button, Layout, Loader, WalletOptionsModal } from "../components";
import { issueCredential } from "../utils/discoClient";
import { getPassportScore, getStamps } from "../utils/gitcoinClient";

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';

import 'react-toastify/dist/ReactToastify.css';



const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [score, setScore] = useState('');
  const [summary, setSummary] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [stamps, setStamps] = useState("");

  const loading = (accountLoading);

  const fetchScore = async (recipient: string) => {
    const data = await getPassportScore(recipient);
    
    if (data) {
      setScore(data.score as string);
      fetchStamps(recipient);
    } else {
      setScore("N/A");
    }
    
    issueScoreCredential(recipient || '', score);
  };

  const fetchStamps = async (recipient: string) => {
    const data = await getStamps(recipient);
    
    if (data) {
      const stamps = data.join(",")
      setStamps(stamps);
      console.log(stamps);
    } else {
      setStamps("");
    }
  };

  const issueScoreCredential = async (recipient: string, score: string): Promise<void> => {
    const schemaUrl = 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GitcoinPassportScoreCredential/1-0-0.json';
    // console.log(typeof(score));
    const subjectData = {
      score: `${score}`,
    };
  
    try {
      console.log(`Issuing Gitcoin Passport score cred to: ${recipient}`);
  
      const credential = await issueCredential(schemaUrl, recipient, subjectData);
      // console.log('Issued credential:', credential);
      if (credential) { 
        setModalIsOpen(true);
      }
  
    } catch (error) {
      console.error('Failed to issue credential:', error);
    }
  };
  

  useEffect(() => {
    console.log({ score });
    console.log({ stamps });
  }, [score]);

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
  

    return (
      <>
        <h1 className="mb-8 text-4xl font-bold">
          Gitcoin Passport Score ~ Disco Demo
        </h1> 

        <h3 className="px-64 pb-12"> 
        Welcome! Gitcoin Passport acts as an aggregator of decentralized society credentials, proving your trustworthiness without needing to collect personally identifiable information. 
        This process transmits more Sybil resistance out to the entire ecosystem.
        <br/> 
        <br/> To easily claim your Gitcoin Passport Score as a credential: <b>Connect your wallet, then click the button below! </b>
        </h3>

        <Button loading={false} onClick={() => fetchScore(accountData?.address || "")}> 
          Get my Score
        </Button>
      </>
    );
  };

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="grid h-screen place-items-center">
          <div className="grid place-items-center">{renderContent()}</div>
        </div>
      </Layout>

      

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
        content: {
          width: '50%',
          margin: '0 auto',
        },
      }}>
        <button onClick={() => setModalIsOpen(false)} className="close-button">
            x
        </button>
        <h2> Your Proof Of Humanness score is: <strong> {score} </strong> </h2>
        <br/> 
        <h2>Passport Stamps found: <strong> {stamps} </strong> </h2>
        {modalContent}
      </Modal>
    </>
  );
};

export default Home;




const modalContent = (
  <div>
    <br/> <br/>
    <h1 className="header">
       Increase your score and collect more stamps  {''}
        <a href="https://passport.gitcoin.co" className="text-blue-500">
          here.
        </a>
        <br/>
        Collect this as a credential in Disco {''}
        <a href="https://app.disco.xyz" className="text-blue-500">
          here.
        </a>
      </h1>
      <br/>
      <p>Remember to mark your credential PUBLIC to use it in other apps!</p>
  </div>
);

