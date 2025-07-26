import { RiSettings5Fill } from "react-icons/ri";
import { HiWrenchScrewdriver } from "react-icons/hi2";

const Maintenance = () => {
  return (
    <div style={{ height: '100vh' }} className='d-flex flex-column'>
      <div  style={{ height: '100vh',
                    alignContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px 10px'
                  }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 text-center w-full transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
        <div className="flex justify-center mb-6 maintenance-logo">
          <RiSettings5Fill size={200} color='#9172EC' className="text-blue-500 text-6xl md:text-8xl animate-bounce" />
          <p className='maintenance-background'></p>
          <HiWrenchScrewdriver className='maintenance-wrench' size={110}/>
        </div>
        <h1 className="p-purple text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          Site Under Maintenance
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
          We're currently performing essential maintenance to improve your experience.
          We apologize for any inconvenience this may cause.
          <br />
          <br />
          <br />
          Please check back shortly. We'll be up and running again soon!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
