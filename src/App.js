import { useState, useEffect, useCallback } from 'react';
import { NFTStorage, File } from 'nft.storage'

import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)

  const [nft, setNFT] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [numInferenceSteps, setNumInferenceSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [image, setImage] = useState(null)
  const [url, setURL] = useState(null)
  const [metadata, setMetadata] = useState(null)

  const [message, setMessage] = useState("")
  const [isWaiting, setIsWaiting] = useState(false)

  const initializeBlockchainData = useCallback(async () => {
    const network = await provider.getNetwork()

    const nft = new ethers.Contract(config[network.chainId].nft.address, NFT, provider)
    setNFT(nft)
  }, [provider]);

  useEffect(() => {
    if(provider){
      initializeBlockchainData();
    }
  }, [provider, initializeBlockchainData]);

  const handleCreateClick = async (e) => {
    e.preventDefault()

    if (description === "" || negativePrompt === "") {
      window.alert("Please provide a description and negative prompts")
      return
    }

    setIsWaiting(true)

    // Call AI API to generate a image based on description
    await createImage()

    setIsWaiting(false)
    setMessage("")
  }

  const handleMintClick = async (e) => {
    e.preventDefault()

    if (name === "" || description === "" || image === null) {
      window.alert("Please provide a name and create an image")
      return
    }

    setIsWaiting(true)

    // Upload image to IPFS (NFT.Storage)
    const url = await uploadImage()

    // Mint NFT
    await mintImage(url)

    setIsWaiting(false)
    setMessage("")
  }

  const createImage = async () => {
    try {
      setMessage('Creating image...')
      console.log('Creating image...');
  
      // You can edit this line for different models
      const URL = "https://cloud.leonardo.ai/api/rest/v1/generations";
  
      const response = await axios({
        url: URL,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_LEONARDO_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          prompt: description,
          modelId: 'b820ea11-02bf-4652-97ae-9ac0cc00593d',
          width: 1024,
          height: 1024,
          negative_prompt: negativePrompt,
          sd_version: 'v2',
          num_images: 1,
          num_inference_steps: numInferenceSteps,
          guidance_scale: guidanceScale,
          presetStyle: 'LEONARDO',
          public: false,
          promptMagic: true
        }
      });
  
      const generationId = response.data.sdGenerationJob.generationId;
  
      // Waiting for the image to be generated. You may need to adjust this time based on your experience.
      await new Promise(resolve => setTimeout(resolve, 15000)); 
  
      // Fetch the image URL
      const imageURLResponse = await axios({
        url: `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_LEONARDO_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      const imageUrl = imageURLResponse.data.generations_by_pk.generated_images[0].url;
  
      setImage(imageUrl);
    } catch (error) {
      console.error('Error in createImage function:', error);
    }
    // Set metadata
    setMetadata({name, description, negativePrompt})
  }

  const uploadImage = async () => {
    setMessage("Uploading Image...")

    // Create instance to NFT.Storage
    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

    // Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([image], "image.jpeg", { type: "image/jpeg" }),
      ...metadata,
    })

    // Save the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
    setURL(url)

    return url
  }

  const mintImage = async (tokenURI) => {
    setMessage("Waiting for Mint...")

    if (provider) {
      const signer = await provider.getSigner()
      const transaction = await nft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("0.1", "ether") })
      await transaction.wait()
    } else {
      alert("Please connect your wallet first.");
    }
  }

  
  return (
    <div className='page_css'>
      <Navigation provider={provider} setProvider={setProvider} />

      <div className='form'>
        <form>
          <input type="text" placeholder="Create a name..." onChange={(e) => { setName(e.target.value) }} />
          <input type="text" placeholder="Create a description..." onChange={(e) => setDescription(e.target.value)} />
          <input type="text" placeholder="Negative prompts..." onChange={(e) => setNegativePrompt(e.target.value)} />
          <label>Guidance Scale: {guidanceScale}</label>
          <input type="range" min="7" max="12" value={guidanceScale} onChange={(e) => setGuidanceScale(parseInt(e.target.value, 10))} />
          <label>Num Inference Steps: {numInferenceSteps}</label>
          <input type="range" min="30" max="60" value={numInferenceSteps} onChange={(e) => setNumInferenceSteps(parseInt(e.target.value, 10))} />
          <input type="submit" value="Create" onClick={handleCreateClick} />
          <input type="submit" value="Mint: 1 ETH*" onClick={handleMintClick} />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="Generated NFT" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!isWaiting && url && (
        <p>
          View &nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
        </p>
      )}
    </div>
  );
}

export default App;
