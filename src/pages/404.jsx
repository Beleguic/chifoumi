import { Link } from "react-router-dom";
import animateTrain from "../components/trainAnimation";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center h-200 text-center">
			<h1 className="text-4xl font-bold text-red-600">404 - Page non trouvée</h1>
			<p className="mt-4 text-lg text-gray-600">Oups ! La page que vous cherchez n&apos;existe pas.</p>
			<Link
				to="/matches"
				className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:brightness-110"
			>
				Retour à l&apos;accueil
			</Link>
			
			<div className="w-full">{animateTrain("RER", "left-to-right")}</div>
			<div className="w-full">{animateTrain("Metro", "right-to-left")}</div>
		</div>
	);
};

export default NotFound;
