import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
 const ABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "getItemsByOwner",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "itemCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "items",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "address payable",
          name: "seller",
          type: "address",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "bool",
          name: "isSold",
          type: "bool",
        },
        {
          internalType: "string",
          name: "imageUrl",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_price",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_imageUrl",
          type: "string",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
      ],
      name: "listItem",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "ownedItems",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "purchaseItem",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
      ],
      name: "transferItem",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
 
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [owner, setOwner] = useState("");
 
  const [filter, setFilter] = useState({ name: "", price: "", owner: "" });
  const [showFilter, setShowFilter] = useState(false);
 
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
 
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
 
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
 
        const signer = provider.getSigner();
        setSigner(signer);
 
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(contract);
 
        // Fetch contract owner
        const contractOwner = await contract.owner();
        setOwner(contractOwner);
 
        loadItems(contract);
        loadOwnedItems(contract, accounts[0]); // Pass the connected account
 
        // Re-sync everything when the user switches accounts in MetaMask
        const handleAccountsChanged = async (newAccounts) => {
          if (newAccounts.length === 0) {
            setAccount("");
            return;
          }
          const newSigner = provider.getSigner();
          const newContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            ABI,
            newSigner
          );
          setAccount(newAccounts[0]);
          setSigner(newSigner);
          setContract(newContract);
          loadItems(newContract);
          loadOwnedItems(newContract, newAccounts[0]);
        };
 
        const handleChainChanged = () => {
          window.location.reload();
        };
 
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
 
        return () => {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
      }
    };
    init();
  }, []);
 
  const loadItems = async (contract) => {
    const itemCount = await contract.itemCount();
    const items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await contract.items(i);
      items.push(item);
    }
    setItems(items);
  };
 
  const loadOwnedItems = async (contract, currentAccount) => {
    const itemCount = await contract.itemCount();
    const ownedItems = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await contract.items(i);
      if (item.owner.toLowerCase() === currentAccount.toLowerCase()) {
        ownedItems.push(item);
      }
    }
    setOwnedItems(ownedItems);
  };
 
  const listItem = async (name, description, price, imageUrl) => {
    const itemDescription = description ? description : "N/A";
 
    const tx = await contract.listItem(
      name,
      ethers.utils.parseEther(price),
      imageUrl,
      itemDescription
    );
    await tx.wait();
    loadItems(contract);
 
    // Reset the form fields
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemImageUrl("");
  };
 
  const purchaseItem = async (id, price) => {
    const tx = await contract.purchaseItem(id, {
      value: ethers.utils.parseEther(price),
    });
    await tx.wait();
    loadItems(contract);
    loadOwnedItems(contract, account);
  };
 
  const transferItem = async (id, toAddress) => {
    const tx = await contract.transferItem(id, toAddress);
    await tx.wait();
    loadItems(contract);
    loadOwnedItems(contract, account);
  };
 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };
 
  const filteredItems = items.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(filter.name.toLowerCase());
    const matchesPrice =
      !filter.price ||
      ethers.utils.formatEther(item.price).includes(filter.price);
    const matchesOwner =
      !filter.owner ||
      item.owner.toLowerCase().includes(filter.owner.toLowerCase());
    return matchesName && matchesPrice && matchesOwner;
  });
 
  const clearFilters = () => {
    setFilter({ name: "", price: "", owner: "" });
    document.getElementById("priceRange").value = 0;
    document.getElementById("itemName").value = "";
  };
 
  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">VehicleVault</div>
        <div className="navbar-links">
          <span>
            {account.toLowerCase() === owner.toLowerCase()
              ? "Owner Account"
              : `Account: ${account}`}
          </span>
        </div>
      </nav>
 
      <header className="header">
        <h1>Welcome to the VehicleVault</h1>
        <p>
          Your hub for trading, discovering, and managing digital vehicles
          effortlessly!
        </p>
      </header>
 
      <section className="form-section">
        <h2 className="title">List an Item</h2>
        <form
          className="item-form"
          onSubmit={(e) => {
            e.preventDefault();
            listItem(itemName, itemDescription, itemPrice, itemImageUrl);
          }}
        >
          <input
            name="itemName"
            placeholder="Item Name"
            className="input-field"
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <input
            name="itemDescription"
            placeholder="Item Description (optional)"
            className="input-field"
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <input
            name="itemPrice"
            placeholder="Item Price (ETH)"
            type="number"
            step="0.01"
            className="input-field"
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
          <input
            name="itemImageUrl"
            placeholder="Item Image URL"
            type="url"
            className="input-field"
            onChange={(e) => setItemImageUrl(e.target.value)}
          />
          {itemImageUrl && (
            <div className="image-preview">
              <img src={itemImageUrl} alt="Image Preview" />
            </div>
          )}
          <button type="submit" className="button">
            List Item
          </button>
        </form>
      </section>
 
      {/* Toggle Filter Button */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilter((prevState) => !prevState)}
      >
        {showFilter ? "Hide Filters" : "Show Filters"}
      </button>
 
      {/* Filter Section */}
      <section
        className="filter-section"
        style={{ display: showFilter ? "block" : "none" }}
      >
        <h2 className="filter-title">Filter Items</h2>
        <div className="filter-options">
          <div className="filter-option">
            <label htmlFor="priceRange">Price Range:</label>
            <input
              id="priceRange"
              name="price"
              type="range"
              min="0"
              max="1000"
              step="10"
              className="filter-range"
              onChange={handleFilterChange}
            />
            <span id="priceRangeValue" className="filter-range-value">
              {filter.price ? `${filter.price} ETH` : "0 ETH"}
            </span>
          </div>
          <div className="filter-option">
            {/* <label htmlFor="itemName">Item Name:</label> */}
            <input
              id="itemName"
              name="name"
              type="text"
              placeholder="Search by name"
              className="filter-input"
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <button className="filter-clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </section>
 
      {/* Items Listing Section */}
      <section className="items-section" id="items-for-sale">
        <h2 className="title">Items for Sale</h2>
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="item-image"
                onError={(e) =>
                  (e.target.src =
                    "https://img.freepik.com/premium-vector/default-ima…ign-mobile-app-no-photo-available_87543-11093.jpg")
                }
              />
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Description:</strong> {item.description || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> {ethers.utils.formatEther(item.price)}{" "}
                ETH
              </p>
              <p className="owner">
                <strong>Owner:</strong> {item.owner}
              </p>
              {!item.isSold &&
                item.owner.toLowerCase() !== account.toLowerCase() && (
                  <button
                    className="button"
                    onClick={() =>
                      purchaseItem(
                        item.id,
                        ethers.utils.formatEther(item.price)
                      )
                    }
                  >
                    Purchase
                  </button>
                )}
            </div>
          ))}
        </div>
      </section>
 
      {/* Your Own Items Section */}
      <section className="items-section" id="my-items">
        <h2 className="title">Your Own Items</h2>
        <div className="items-grid">
          {ownedItems.map((item) => (
            <div key={item.id} className="item-card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="item-image"
                onError={(e) =>
                  (e.target.src =
                    "https://img.freepik.com/premium-vector/default-ima…ign-mobile-app-no-photo-available_87543-11093.jpg")
                }
              />
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Description:</strong> {item.description || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> {ethers.utils.formatEther(item.price)}{" "}
                ETH
              </p>
              <p className="owner">
                <strong>Owner:</strong> {item.owner}
              </p>
              <input
                id={`transferAddress${item.id}`}
                placeholder="Transfer to address"
                className="input-field1"
              />
              <button
                className="button1"
                onClick={() =>
                  transferItem(
                    item.id,
                    document.getElementById(`transferAddress${item.id}`).value
                  )
                }
              >
                Transfer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
 
export default App;