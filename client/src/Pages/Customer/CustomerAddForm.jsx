import { useState } from "react";
import { postCustomer } from "@/store/Slices/customer.slice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdClose } from "react-icons/io";

const CustomerAddForm = ({ onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.customer || {});

  const initialForm = {
    licenseNo: "",
    expiryDate: "",
    name: "",
    phone: "",
    dcNumber: "",
    suburb: "",
    state: "",
    address: "",
    postalCode: "",
    email: "",
  };

  const [form, setForm] = useState({ ...initialForm });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(postCustomer(form)).unwrap();
      if (onAdd) onAdd(res);
      setForm({ ...initialForm });
      onCancel();
    } catch (err) {
      console.error("Failed to add customer:", err);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 col-span-full text-center uppercase">
          Add New Customer
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-8 text-gray-400 hover:text-purple-700 text-2xl focus:outline-none cursor-pointer z-10"
          aria-label="Close form"
        >
          <IoMdClose size={24} />
        </button>

        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "License Number", name: "licenseNo", type: "text" },
          { label: "License Expiry Date", name: "expiryDate", type: "date" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "DC Number", name: "dcNumber", type: "text" },
          { label: "Suburb", name: "suburb", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Postal Code", name: "postalCode", type: "text" },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name} className={name === "address" ? "col-span-full" : ""}>
            <Label htmlFor={name} className="mb-2 inline-block">
              {label}
              <span className="text-red-500"> *</span>
            </Label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={label}
              value={form[name]}
              onChange={handleChange}
              required
              {...rest}
            />
          </div>
        ))}

        <div className="col-span-full flex justify-end gap-3 mt-4">
          <Button
            type="submit"
            className="bg-purple-700 text-white cursor-pointer"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerAddForm;
