import { getProviders, signIn } from "next-auth/react"

function Login({ providers }){
    return (
        <div className="flex flex-col items-center bg-[#FEFAF3] min-h-screen w-full justify-center">
            <img className="w-52 mb-5" src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="" />

            <h1 className="">Testing Hub</h1>
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button className="bg-[#3a7fed] text-white p-5 rounded"
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                    Sign In with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}

