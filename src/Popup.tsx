import { useGlobal } from "@/hooks/useGlobal";
import { Power, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Dialog from "@/components/Dialog";

// const defaultToBlock = [

// ];

function Popup() {
	const { focus, toogleFocus, links, deleteLink } = useGlobal();
	// const [focus, setFocus] = useState(false);
	// const [open, setOpen] = useState(false);
	// const [toBlock, setToBlock] = useState<TBlock[]>([]);

	const startFocusMode = () => {
		toogleFocus(!focus);
	};

	const deleteItem = (id: number) => {
		deleteLink(id);
	};
	return (
		<>
			<main className="w-full p-4">
				<Button
					variant="outline"
					className={`${focus ? "bg-green-500" : "bg-red-500"}  hover:opacity-80 transition-all hover:scale-105 ${focus ? "hover:bg-green-500" : "hover:bg-red-500"} `}
					onClick={startFocusMode}
				>
					<Power className="mr-2" /> {focus ? "Active" : "Power Off"}
				</Button>

				<section className="grid mt-4 place-content-start">
					<div className="flex items-center justify-center gap-x-2">
						<h2 className="text-2xl">To block</h2>
						<Dialog />
					</div>
					<ScrollArea className="w-full h-[200px] mt-3">
						<ul className="grid px-4 gap-y-1 ">
							{links.map(({ name, url, id }) => (
								<li
									key={id}
									data-url={url}
									className="flex items-center justify-between group/item gap-x-2"
								>
									<span>{name}</span>
									<X
										className="w-4 h-4 duration-200 opacity-0 cursor-pointer hover:text-red-500 group-hover/item:opacity-100"
										onClick={() => deleteItem(id)}
									/>
								</li>
							))}
						</ul>
					</ScrollArea>
				</section>
			</main>
		</>
	);
}
Popup.displayName = "Popup";
export default Popup;
