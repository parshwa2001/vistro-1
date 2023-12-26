import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../../components/Icon/IconLayoutGrid';
import IconSearch from '../../../components/Icon/IconSearch';
import IconUser from '../../../components/Icon/IconUser';
import IconFacebook from '../../../components/Icon/IconFacebook';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconLinkedin from '../../../components/Icon/IconLinkedin';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconX from '../../../components/Icon/IconX';
import axios from 'axios';
import config from '../../../congif/config';

const Driver = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        "name": "John Doe",
        "phone": "1234567890",
        "contactNumber": "15545455454",
        "email": "vishal@examplehhh.com",
        "address1": "123 Main St",
        "address2": "Apt 4",
        "country": "USA",
        "state": "CA",
        "city": "San Francisco",
        "truckType": "Semi",
        "passportNumber": "ABC123",
        "passportExpiryDate": "2023-12-31",
        "idCardNumber": "XYZ456",
        "idCardExpiryDate": "2023-12-31",
        "drivingLicenseNumber": "DEF789",
        "drivingLicenseExpiryDate": "2023-12-31",
        "truckNumber": "TRK123",
        "truckExpiryDate": "2023-12-31",
        "status": "Active",
        "whatsappNumber": "7040131845",
        "remark": "Goods"
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const responce = await axios.get(`${config.API_BASE_URL}/drivers`);
            console.log(responce.data);

            setUserData(responce.data);
            console.log(userData);
        };
        fetch();
    }, [addContactModal]);
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const [value, setValue] = useState<any>('list');

    const changeValue = (e: any) => {
        const { value, id, name } = e.target;
        setParams({ ...params, [name]: value });
    };

    const [search, setSearch] = useState<any>('');
    // static for now
    let [contactList] = useState<any>(userData);

    const [filteredItems, setFilteredItems] = useState<any>(userData);
    console.log(filteredItems, 'filteredItems', userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        let addUSer = await axios.post(`${config.API_BASE_URL}/drivers`, params);
        setAddContactModal(false);
        showMessage('User has been saved successfully.');
        setAddContactModal(false);
    };

    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            // console.log(update);
        }
        // const update = await axios.put(`http://93.188.164.69:3004/api/client/${params.id}`,params)
        // console.log(update , "update >>>>>>>>>>>>>>>>>>>");
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        // setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        await axios.delete(`${config.API_BASE_URL}/client/${user.client_id}`);
        showMessage('client has been deleted successfully.');
    };

    const ViewUser = async (user: any = null) => {
        // await axios.get(`http://93.188.164.69:3004/api/client/${user.client_id}`);
        setViewContactModal(true);
        setAddContactModal(true);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Client</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Driver
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Driver Name</th>
                                    <th>phone</th>
                                    <th>email</th>
                                    <th>Whatsapp No.</th>
                                    <th>status</th>
                                    <th>remark</th>
                                    <th>truckType</th>
                                    <th>Address</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.driver_id}</td>
                                            <td className="whitespace-nowrap">{contact.name}</td>
                                            <td className="whitespace-nowrap">{contact.phone}</td>
                                            <td className="whitespace-nowrap">{contact.email}</td>
                                            <td className="whitespace-nowrap">{contact.whatsappNumber}</td>
                                            <td className="whitespace-nowrap">{contact.status}</td>
                                            <td className="whitespace-nowrap">{contact.remark}</td>
                                            <td className="whitespace-nowrap">{contact.truckType}</td>
                                            <td className="whitespace-nowrap">{contact.address1}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ViewUser(contact)}>
                                                        view
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {value === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {filteredItems.map((contact: any) => {
                        return (
                            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={contact.id}>
                                <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                    <div
                                        className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
                                        style={{
                                            backgroundImage: `url('/assets/images/notification-bg.png')`,
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        <img className="object-contain w-4/5 max-h-40 mx-auto" src={`/assets/images/${contact.path}`} alt="contact_image" />
                                    </div>
                                    <div className="px-6 pb-24 -mt-10 relative">
                                        <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                                            <div className="text-xl">{contact.name}</div>
                                            <div className="text-white-dark">{contact.role}</div>
                                            <div className="flex items-center justify-between flex-wrap mt-6 gap-3">
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.posts}</div>
                                                    <div>Posts</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.following}</div>
                                                    <div>Following</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.followers}</div>
                                                    <div>Followers</div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ul className="flex space-x-4 rtl:space-x-reverse items-center justify-center">
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconFacebook />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconInstagram />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconLinkedin />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconTwitter />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                <div className="truncate text-white-dark">{contact.email}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                <div className="text-white-dark">{contact.phone}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                <div className="text-white-dark">{contact.location}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                                        <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(contact)}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(contact)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.client ? 'Edit Contact' : 'Add Driver'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div>
                                                <label htmlFor="name">Driver Name</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={params.name}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver Name"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={params.phone}
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                    placeholder="123-456-7890"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email">email</label>
                                                <input
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    value={params.email}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver email"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="address1">address1</label>
                                                <input
                                                    id="address1"
                                                    type="text"
                                                    name="address1"
                                                    value={params.address1}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver address1"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="address2">address2</label>
                                                <input
                                                    id="address2"
                                                    type="text"
                                                    name="address2"
                                                    value={params.address2}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver address2"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="country">country</label>
                                                <input
                                                    id="country"
                                                    type="text"
                                                    name="country"
                                                    value={params.country}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver country"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="state">state</label>
                                                <input
                                                    id="state"
                                                    type="text"
                                                    name="state"
                                                    value={params.state}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver state"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="city">city</label>
                                                <input
                                                    id="city"
                                                    type="text"
                                                    name="city"
                                                    value={params.city}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver city"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="truckType">truckType</label>
                                                <input
                                                    id="truckType"
                                                    type="text"
                                                    name="truckType"
                                                    value={params.truckType}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver truckType"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="passportNumber">passportNumber</label>
                                                <input
                                                    id="passportNumber"
                                                    type="text"
                                                    name="passportNumber"
                                                    value={params.passportNumber}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver passportNumber"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="idCardExpiryDate">idCardExpiryDate</label>
                                                <input
                                                    id="idCardExpiryDate"
                                                    type="date"
                                                    name="idCardExpiryDate"
                                                    value={params.idCardExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver idCardExpiryDate"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="idCardNumber">idCardNumber</label>
                                                <input
                                                    id="idCardNumber"
                                                    type="text"
                                                    name="idCardNumber"
                                                    value={params.idCardNumber}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver idCardNumber"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="idCardExpiryDate">idCardExpiryDate</label>
                                                <input
                                                    id="idCardExpiryDate"
                                                    type="date"
                                                    name="idCardExpiryDate"
                                                    value={params.idCardExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver idCardExpiryDate"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="drivingLicenseNumber">drivingLicenseNumber</label>
                                                <input
                                                    id="drivingLicenseNumber"
                                                    type="text"
                                                    name="drivingLicenseNumber"
                                                    value={params.drivingLicenseNumber}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver drivingLicenseNumber"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="drivingLicenseExpiryDate">drivingLicenseExpiryDate</label>
                                                <input
                                                    id="drivingLicenseExpiryDate"
                                                    type="date"
                                                    name="drivingLicenseExpiryDate"
                                                    value={params.drivingLicenseExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver drivingLicenseExpiryDate"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="truckNumber">truckNumber</label>
                                                <input
                                                    id="truckNumber"
                                                    type="text"
                                                    name="truckNumber"
                                                    value={params.truckNumber}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver truckNumber"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="truckExpiryDate">truckExpiryDate</label>
                                                <input
                                                    id="truckExpiryDate"
                                                    type="date"
                                                    name="truckExpiryDate"
                                                    value={params.truckExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver truckExpiryDate"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="status">status</label>
                                                <input
                                                    id="status"
                                                    type="text"
                                                    name="status"
                                                    value={params.status}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver status"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="whatsappNumber">whatsappNumber</label>
                                                <input
                                                    id="whatsappNumber"
                                                    type="text"
                                                    name="whatsappNumber"
                                                    value={params.whatsappNumber}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver whatsappNumber"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="remark">remark</label>
                                                <input
                                                    id="remark"
                                                    type="text"
                                                    name="remark"
                                                    value={params.remark}
                                                    onChange={(e) => changeValue(e)}
                                                    placeholder="Enter Driver remark"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-center items-center mt-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {/* {params.driver_id ? 'Update' : 'Submit'} */}
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Driver;
