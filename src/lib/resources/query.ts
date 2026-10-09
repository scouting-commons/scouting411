import { resources } from "@/lib/resources/config";

/** query all resources. currently just a stub api */
export function queryResources() {
	//todo
	return resources.toSorted((a, b) => a.title.localeCompare(b.title));
}
