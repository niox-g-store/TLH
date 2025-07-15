/*
 *
 * DisabledOrganizerAccount
 *
 */
import { MdOutlineWhatsapp, MdOutlineMailOutline } from "react-icons/md";
import Button from "../../../components/Common/HtmlTags/Button";

const DisabledOrganizerAccount = (props) => {
  const { user, isLightMode, signOut } = props;

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        isLightMode ? 'bg-white p-black' : 'bg-black p-white'
      }`}
      style={{ minHeight: 250, height: '100vh' }}
    >
      <h3 className='mb-3'>Hi, {user?.organizer?.companyName}</h3>
      <div
        className={`p-4 rounded-sm ${
          isLightMode ? 'bg-light' : 'text-white'
        }`}
      >
        <h5>Unfortunately it seems your account has been disabled.</h5>
        <p className={`${isLightMode ? 'text-muted' : 'text-gray'} mb-1`}>
          Please contact admin to request access again.
        </p>
        <div style={{ display: 'flex', gap: '2em', justifyContent: 'center' }} className='mt-2'>
          <a className={`${isLightMode ? 'text-muted' : 'text-gray'}`} href="mailto:contact@thelinkhangout.com">
            <MdOutlineMailOutline size={20} /> Email
          </a>
          OR
          <a className={`${isLightMode ? 'text-muted' : 'text-gray'}`} target="_blank" href="https://wa.me/message/PIGYWR7NTGHKK1">
            <MdOutlineWhatsapp size={20}/> Whatsapp
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }} onClick={signOut}>
          <Button text={"logout"} style={{ padding: '15px 20px' }}/>
        </div>
      </div>
    </div>
  );
};

export default DisabledOrganizerAccount;
