import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function Navigation({ provider, setProvider }) {
  const [account, setAccount] = useState(localStorage.getItem('connectedAccount') || null);
  
  useEffect(() => {
    // if there's an account in the localStorage, initialize the provider
    const localStorageAccount = localStorage.getItem('connectedAccount');
    if (localStorageAccount) {
      setAccount(localStorageAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, [provider, setProvider]); // add setProvider to the dependencies
  
  const connectHandler = async () => {
    // Prompt the user to give account access permission
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }],
      });
    } catch (error) {
      console.error("User rejected account access");
    }
  
    // Get the user's account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    localStorage.setItem("connectedAccount", account);
    setAccount(account);
  
    // Initialize the provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  };
  
  

  const disconnectHandler = () => {
    localStorage.removeItem("connectedAccount");
    setAccount(null);
    window.location.reload();
  };

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Cosmic Draco's NFT Generator</h1>
      </div>

      {account ? (
        <div className='dropdown'>
          <div 
            className='nav__connect nav__connect--account' 
            onClick={(e) => e.stopPropagation()}
          >
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </div>
          <div className="dropdown-content">
            <button onClick={disconnectHandler}>Disconnect</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
