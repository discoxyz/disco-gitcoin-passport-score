import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import { Button, Layout, Loader, WalletOptionsModal } from "../components";
import { issueCredential } from "../utils/discoClient";
import { getCreditScore } from "../utils/gitcoinClient";

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';

import 'react-toastify/dist/ReactToastify.css';



const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [score, setScore] = useState('');
  const [summary, setSummary] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const loading = (accountLoading);

  const fetchScore = async (recipient: string) => {
    const data = await getCreditScore(recipient);
    
    if (data) {
      setScore(data.score as string);
    } else {
      setScore("N/A");
    }

    // issueCreditCredential(recipient || '', score)
  };

  const issueCreditCredential = async (recipient: string, score: string): Promise<void> => {
    const schemaUrl = 'https://raw.githubusercontent.com/discoxyz/disco-schemas/e2e3d4817aa769194e42470bf67d4b30ae3585f9/json/DigitalAssetScoreCredential/1-0-0.json';
    console.log(typeof(score));
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
    
    setSummary(`Your Proof Of Humanness score is: ${score}. You can increase this by collecting Gitcoin Passport Stamps`);
  }, [score]);

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
  

    return (
      <>
        <h1 className="mb-8 text-4xl font-bold">
          Gitcoin Passport Score
        </h1> 
        <h3> 
        Gitcoin Passport acts as an aggregator of decentralized society credentials, proving your trustworthiness without needing to collect personally identifiable information. This process transmits more Sybil resistance out to the entire ecosystem.<br/>
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
          <div> <strong>{summary}<a href="https://passport.gitcoin.co/"> here. </a></strong> </div>
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
        <h2> {summary} </h2>
        {modalContent}
      </Modal>
    </>
  );
};

export default Home;




const modalContent = (
  <div>
    <h1 className="header">
        Manage your score in{' '}
        <a href="https://app.disco.xyz" className="text-blue-500">
          Disco.
        </a>
      </h1>
      <br/>
      <p>Remember to mark your credential PUBLIC to use it in other apps!</p>
  </div>
);

