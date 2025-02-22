import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import axios from "axios";

const ProfileForm = ({ customerDetails, updateCustomerDetails }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: customerDetails.name,
    phone: customerDetails.phone,
    email: customerDetails.email,
    addresses: customerDetails.addresses || [],
  });
  const [postOffices, setPostOffices] = useState([]);

  const handleChange = (e) => {
    if (!isEditMode) return;
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (index, e) => {
    if (!isEditMode) return;
    const { name, value } = e.target;
    const newAddresses = [...formData.addresses];
    newAddresses[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      addresses: newAddresses,
    }));
  };

  const handlePincodeChange = async (index, pincode) => {
    if (!isEditMode) return;
    if (pincode.length === 6) {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (response.data && response.data[0].Status === "Success") {
          const postOfficesData = response.data[0].PostOffice;
          setPostOffices(postOfficesData);

          if (postOfficesData.length > 0) {
            const newAddresses = [...formData.addresses];
            const selectedPostOffice = postOfficesData[0];
            newAddresses[index] = {
              ...newAddresses[index],
              state: selectedPostOffice.State,
              district: selectedPostOffice.District,
              region: selectedPostOffice.Region,
              postOffice: selectedPostOffice.Name,
            };
            setFormData((prevData) => ({
              ...prevData,
              addresses: newAddresses,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
      }
    }
  };

  const handlePostOfficeSelect = (index, selectedPostOffice) => {
    if (!isEditMode) return;
    const newAddresses = [...formData.addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      state: selectedPostOffice.State,
      district: selectedPostOffice.District,
      region: selectedPostOffice.Region,
      postOffice: selectedPostOffice.Name,
    };
    setFormData((prevData) => ({
      ...prevData,
      addresses: newAddresses,
    }));
  };

  const addAddress = () => {
    if (!isEditMode) return;
    setFormData((prevData) => ({
      ...prevData,
      addresses: [
        ...prevData.addresses,
        {
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          state: "",
          district: "",
          region: "",
          postOffice: "",
        },
      ],
    }));
  };

  const removeAddress = (index) => {
    if (!isEditMode) return;
    const newAddresses = [...formData.addresses];
    newAddresses.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      addresses: newAddresses,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCustomerDetails(formData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
      addresses: customerDetails.addresses || [],
    });
    setIsEditMode(false);
  };

  const inputClassName = `w-full px-4 py-2 rounded-xl text-white transition-all duration-200 ${
    isEditMode
      ? "bg-gray-800/80 border border-blue-500/20 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_8px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
      : "bg-gray-800/40 border-transparent shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2)] cursor-not-allowed"
  }`;

  const cardClassName = "bg-gray-900 border-none rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.05)] overflow-hidden";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <Card className={cardClassName}>
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Profile Details</h2>
            {!isEditMode ? (
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-xl hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-xl hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Address Book</h3>
                {isEditMode && (
                  <Button
                    type="button"
                    onClick={addAddress}
                    className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Address
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {formData.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-gray-800/30 shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.05)] relative"
                  >
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAddress(index)}
                        className="absolute top-4 right-4 h-8 w-8 text-red-500 hover:text-red-400 hover:bg-gray-800/50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 mb-2">Address Line 1*</label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={address.addressLine1}
                          onChange={(e) => handleAddressChange(index, e)}
                          className={inputClassName}
                          required
                          disabled={!isEditMode}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Address Line 2</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={address.addressLine2}
                          onChange={(e) => handleAddressChange(index, e)}
                          className={inputClassName}
                          disabled={!isEditMode}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Pincode*</label>
                        <input
                          type="text"
                          name="pincode"
                          value={address.pincode}
                          onChange={(e) => {
                            handleAddressChange(index, e);
                            handlePincodeChange(index, e.target.value);
                          }}
                          className={inputClassName}
                          required
                          disabled={!isEditMode}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          readOnly
                          className={`${inputClassName} cursor-not-allowed`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">District</label>
                        <input
                          type="text"
                          name="district"
                          value={address.district}
                          readOnly
                          className={`${inputClassName} cursor-not-allowed`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Region</label>
                        <input
                          type="text"
                          name="region"
                          value={address.region}
                          readOnly
                          className={`${inputClassName} cursor-not-allowed`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Post Office</label>
                        {postOffices.length > 1 && isEditMode ? (
                          <select
                            name="postOffice"
                            value={address.postOffice}
                            onChange={(e) => {
                              const selectedPostOffice = postOffices.find(
                                (po) => po.Name === e.target.value
                              );
                              handlePostOfficeSelect(index, selectedPostOffice);
                            }}
                            className={inputClassName}
                            disabled={!isEditMode}
                          >
                            {postOffices.map((po, idx) => (
                              <option key={idx} value={po.Name}>
                                {po.Name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="postOffice"
                            value={address.postOffice}
                            readOnly
                            className={`${inputClassName} cursor-not-allowed`}
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

ProfileForm.propTypes = {
  customerDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        pincode: PropTypes.string,
        state: PropTypes.string,
        district: PropTypes.string,
        region: PropTypes.string,
        postOffice: PropTypes.string,
      })
    ),
  }).isRequired,
  updateCustomerDetails: PropTypes.func.isRequired,
};

export default ProfileForm;