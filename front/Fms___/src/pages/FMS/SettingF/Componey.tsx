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

const Company = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        adminId: 1,
        business_type: 1,
        business_logo: 'logo.png',
        business_name: 'Smart soluion Company',
        contact_person_full_name: 'vishal Doe',
        phone: 12345678,
        whatsapp_contact: 9876543210,
        password: '123',
        subscription_type: 1,
        gateway_enabled: true,
        gateway_type: 1,
        gateway_merchant_id: 'merchant_id',
        gateway_api_key: 'api_key',
        email: 'vishal@example441.in',
        citys: 'City',
        state: 'State',
        pincode: '12345',
        address: 'Company Address',
        start_at: '2023-01-01',
        expiry_at: '2023-12-31',
        renewed_at: '2023-12-01',
        country_name: 'India',
        currency_code: 'USD',
        currency_symbol: '$',
        status: 1,
        description: 'Company Description',
        remarks: 'Remarks about the company',
        address1: 'address1',
        citys1: 'citys1',
        state1: 'state1',
        pincode1: '41444',
        country_name1: 'country_name1',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/companies`);
            console.log(data.data);

            setUserData(data.data);
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
                return item.business_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        if (Object.values(params).some((x) => x === null || x === '')) {
            showMessage('somthing  is missing', 'error');
            return true;
        }

        console.log(params, 'paraams >>>>>>>>>>>>>>>>>');
        if (params.company_id) {
            //update user

            delete params.id;
            let user: any = filteredItems.find((d: any) => d.client_id === params.client_id);
            // const update = await axios.put(`http://localhost:3004/api/users:${params.id}`,params)
            // console.log(update);
            const update = await axios.put(`${config.API_BASE_URL}/client/${params.client_id}`, params);
            console.log(update, 'lets checck');
        } else {
            //add user
            let maxUserId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

            let user = {
                id: maxUserId + 1,
                path: 'profile-35.png',
                name: params.name,
                email: params.email,
                phone: params.phone,
                role: params.role,
                location: params.location,
                posts: 20,
                followers: '5K',
                following: 500,
            };
            filteredItems.splice(0, 0, user);
            //   searchContacts()
            delete params.id;
            delete params.location;
            // params.params.id = 10000
            params.username = params.phone_number;
            let addUSer = await axios.post(`${config.API_BASE_URL}/companies`, params);
            setAddContactModal(false);
            showMessage('User has been saved successfully.');
        }
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
        // const update = await axios.put(`http://localhost:3004/api/client/${params.id}`,params)
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
        // await axios.get(`http://localhost:3004/api/client/${user.client_id}`);
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
                <h2 className="text-xl">Company</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Company Details
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
                                    <th>Componey Name</th>
                                    <th>contact_person_full_name</th>
                                    <th>type</th>
                                    <th>email</th>
                                    <th>phone</th>
                                    <th>Status</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.company_id}</td>
                                            <td className="whitespace-nowrap">{contact.business_name}</td>
                                            <td className="whitespace-nowrap">{contact.contact_person_full_name}</td>
                                            <td className="whitespace-nowrap">{contact.business_type}</td>
                                            <td className="whitespace-nowrap">{contact.email}</td>
                                            <td className="whitespace-nowrap">{contact.phone}</td>
                                            <td className="whitespace-nowrap">{contact.status === 1 ? 'Active' : 'InActive'}</td>
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
                                        <button type="button" className="btn btn-outline-success w-1/2">
                                            View
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
                                        {params.client ? 'Edit Tracking' : 'Add Company'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div>
                                                <label htmlFor="routename">Company Name</label>
                                                <input
                                                    id="routename"
                                                    onChange={(e) => changeValue(e)}
                                                    value={params.business_name}
                                                    name="business_name"
                                                    type="text"
                                                    placeholder="Enter Componey Name"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4 mb-4">
                                                <label htmlFor="routename">Contact Person Full Name</label>
                                                <input
                                                    id="routename"
                                                    onChange={(e) => changeValue(e)}
                                                    value={params.contact_person_full_name}
                                                    name="contact_person_full_name"
                                                    type="text"
                                                    placeholder="Enter Contact Person Full Name"
                                                    className="form-input"
                                                    required
                                                />
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="Address Line-1">Address Line-1</label>
                                                    <input
                                                        id="routename"
                                                        name="address"
                                                        type="text"
                                                        placeholder="Enter address"
                                                        className="form-input"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.address}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Address Line-2</label>
                                                    <input
                                                        id="routename"
                                                        name="address1"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.address1}
                                                        type="text"
                                                        placeholder="Enter Address1"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address-1 Country</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="country_name"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.country_name}
                                                        placeholder="Enter Country"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address- 2 Country</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.country_name1}
                                                        placeholder="Enter country name 2"
                                                        name="country_name1"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address- 1 state</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="state"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.state}
                                                        placeholder="Enter state"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address- 2 state</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.state1}
                                                        placeholder="Enter state1"
                                                        name="state1"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address-2 City</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="citys"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.citys}
                                                        placeholder="Enter city Name"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>

                                                <div>
                                                    <label htmlFor="routename">Select Address- 2 city </label>
                                                    <input
                                                        id="routename"
                                                        name="citys1"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.citys1}
                                                        type="number"
                                                        placeholder="Enter citys1 Name"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2">Select Address-1 Pincode</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="pincode"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.pincode}
                                                        placeholder="Enter pincode Name"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                </div>

                                                <div>
                                                    <label htmlFor="routename">Select Address 2 Pincode</label>
                                                    <input
                                                        id="routename"
                                                        name="pincode1"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.pincode1}
                                                        type="number"
                                                        placeholder="Enter pincode1 Name"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">Tax Number</label>
                                                    <input
                                                        id="routename"
                                                        name="taxNumber"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.taxNumber}
                                                        type="number"
                                                        placeholder="Enter Tax Number"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnFile">Select LOGO</label>
                                                    <input
                                                        id="ctnFile"
                                                        type="file"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.logo}
                                                        name="logo"
                                                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">whatsapp contact</label>
                                                    <input
                                                        id="routename"
                                                        name="whatsapp_contact"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.whatsapp_contact}
                                                        type="number"
                                                        placeholder="Enter whatsapp contact Numbaer"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Email Address</label>
                                                    <input
                                                        id="routename"
                                                        name="email"
                                                        type="email"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.email}
                                                        placeholder="Enter Email "
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">currency code</label>
                                                    <input
                                                        id="routename"
                                                        name="currency_code"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.currency_code}
                                                        type="text"
                                                        placeholder="Enter currency_code"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">currency_symbol</label>
                                                    <input
                                                        id="routename"
                                                        name="currency_symbol"
                                                        type="text"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.currency_symbol}
                                                        placeholder="Enter currency symbol "
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="routename">Description</label>
                                                <textarea
                                                    id="comment"
                                                    rows={4}
                                                    name="description"
                                                    value={params.description}
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-input"
                                                    placeholder="Write a Description..."
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">start Date</label>
                                                    <input
                                                        id="routename"
                                                        name="start_at"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.start_at}
                                                        type="date"
                                                        placeholder="Enter start_at"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Expired Date</label>
                                                    <input
                                                        id="routename"
                                                        name="expiry_at"
                                                        type="date"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.expiry_at}
                                                        placeholder="Enter currency Expired Date "
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {!viewContactModal && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                        {params.driver_id ? 'Update' : 'Submit'}
                                                    </button>
                                                </div>
                                            )}
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

export default Company;
