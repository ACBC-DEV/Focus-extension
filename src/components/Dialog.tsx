import {
	Dialog as DialogPrimitive,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useGlobal } from "@/hooks/useGlobal";

const Dialog = () => {
	const { open, setOpen, addLink } = useGlobal();
	const [url, setUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (chrome.tabs) {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (tabs[0].url) setUrl(tabs[0]?.url);
			});
		}
	}, []);
	const onAdd = () => {
		const regexStartUrl = /https?:\/\/(www\.)?/g;
		if (!url?.match(regexStartUrl)) {
			setError("Please enter a valid URL");
			return;
		}
		if (!url) return;
		const urlName = url.replace(regexStartUrl, "").replace(/\/.+/g, "");
		const id =
			url.length + urlName.length + Math.floor(Math.random() * url.length);
		addLink({ id, name: urlName, url });
		setUrl(null);
		setOpen(false);
		setError(null);
	};
	return (
		<DialogPrimitive open={open} onOpenChange={() => setOpen(!open)}>
			<DialogTrigger asChild>
				<Button
					onClick={() => setOpen(true)}
					variant="ghost"
					size="sm"
					className="p-2 rounded-full"
				>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent
				onCloseModal={() => setOpen(false)}
				className="h-screen md:h-fit"
			>
				<DialogHeader>
					<DialogTitle>Add a website</DialogTitle>
					<DialogDescription>
						Enter the name of the website you want to block.
					</DialogDescription>
				</DialogHeader>
				<form
					id="form-dialog"
					className="grid gap-4 py-4"
					onSubmit={(event) => {
						event.preventDefault();
						onAdd();
					}}
				>
					<div className="grid items-center justify-center grid-cols-4 gap-4">
						<Label htmlFor="url" className="text-right">
							Url
						</Label>
						<Input
							autoFocus
							id="url"
							type="url"
							value={url ?? ""}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://www.youtube.com"
							className="col-span-3"
						/>
						{error && (
							<span className="mx-auto text-red-500 text-nowrap">{error}</span>
						)}
					</div>
				</form>
				<DialogFooter>
					<Button
						form="form-dialog"
						type="submit"
						onClick={(event) => {
							event.preventDefault();
							onAdd();
						}}
					>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogPrimitive>
	);
};
Dialog.displayName = "Dialog";

export { Dialog };
export default Dialog;
