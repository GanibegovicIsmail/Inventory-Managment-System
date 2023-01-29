import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AddSupplierModal } from "../components";
import { Context } from "../Helper/Context";
import useToggle from "../Hooks/useToggle";

const Supplier = () => {
  const { token } = useContext(Context);
  const [isOpen, toggle] = useToggle();
  const [suppliers, setSuppliers] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [supplierData, setSupplierData] = useState({
    id: "",
    name: "",
    jib: "",
    pdv: "",
    telephone: "",
    contactPerson: "",
    email: "",
    startDate: "",
    completionDate: "",
  });

  const clearInputField = () => {
    setSupplierData({
      id: "",
      name: "",
      jib: "",
      pdv: "",
      telephone: "",
      contactPerson: "",
      email: "",
      startDate: "",
      completionDate: "",
    });
  };

  const getSuppliers = async () => {
    await axios
      .get(`http://localhost:5000/api/supplier/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setSuppliers(response.data))
      .catch((err) => console.log(err));
  };

  const handleAddSupplier = () => {
    axios
      .post(`http://localhost:5000/api/supplier/add-supplier`, supplierData)
      .then(() => {
        setSuppliers([...suppliers, supplierData]);
        clearInputField();
      });
  };

  const updateSupplierData = (id) => {
    let supplier = suppliers.find((supplier) => supplier._id === id);
    setSupplierData({
      ...supplier,
      startDate: supplier?.startDate?.slice(0, 10),
      completionDate: supplier?.completionDate?.slice(0, 10),
    });
  };

  const updateSupplier = async () => {
    await axios
      .patch("http://localhost:5000/api/supplier/update", supplierData)
      .then((response) => response.data)
      .catch((err) => err);
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <div className="bg-violet-100 h-screen absolute w-full">
      {isOpen && (
        <AddSupplierModal
          toggle={toggle}
          setSupplierData={setSupplierData}
          handleAddSupplier={handleAddSupplier}
          supplierData={supplierData}
          clearInputField={clearInputField}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          updateSupplier={updateSupplier}
        />
      )}

      <div className="mt-32 max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center my-8"></div>
        <button
          onClick={toggle}
          className="px-5 py-3 bg-violet-900  hover:bg-violet-500 hover:text-white text-white text-xl rounded-3xl mb-10"
        >
          Dodaj Dobavljaca
        </button>
        <div class="flex flex-col">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full">
                  <thead class="border-b">
                    <tr className="text-xs bg-violet-900  text-white">
                      <th scope="col" className="pl-6 pr-4 py-3">
                        REDNI BROJ
                      </th>
                      <th scope="col" className="pl-6 pr-4 py-3">
                        IME
                      </th>
                      <th scope="col" className="px-4 py-3">
                        JIB
                      </th>
                      <th scope="col" className="px-4 py-3">
                        PDV
                      </th>
                      <th scope="col" className="px-4 py-3">
                        TELEFON
                      </th>
                      <th scope="col" className="px-4 py-3">
                        KONTAKT
                      </th>
                      <th scope="col" className="px-4 py-3">
                        EMAIL
                      </th>
                      <th scope="col" className="px-4 py-3">
                        DATUM POCETKA
                      </th>
                      <th scope="col" className="px-4 py-3">
                        DATUM ZAVRSETKA
                      </th>
                      <th scope="col" className="px-4 py-3">
                        AZURIRAJ
                      </th>
                    </tr>
                  </thead>
                  {suppliers.length > 0 && (
                    <tbody>
                      {suppliers.map((supplier, i) => (
                        <tr key={supplier?._id} class="border-b">
                          <td className="pl-6 pr-4 py-4">{i + 1}</td>
                          <td className="pl-6 pr-4 py-4">{supplier?.name}</td>
                          <td className="p-4">{supplier?.jib}</td>
                          <td className="p-4">{supplier?.pdv}</td>
                          <td className="p-4">{supplier?.telephone}</td>
                          <td className="p-4">{supplier?.contactPerson}</td>
                          <td className="p-4">{supplier?.email}</td>
                          <td className="p-4">
                            {supplier?.startDate?.slice(0, 10)}
                          </td>
                          <td className="p-4">
                            {supplier?.completionDate?.slice(0, 10) || ""}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                toggle();
                                setIsUpdate(true);
                                updateSupplierData(supplier?._id);
                              }}
                              className="bg-violet-900 rounded-3xl px-5 py-2 text-white text-base  hover:bg-violet-500"
                            >
                              Azuriraj
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supplier;
