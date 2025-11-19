'use client'

import { addCompetitorLink } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"

const initialState = {
    error: "",
}

export function AddCompetitorForm({ productId }: { productId: string }) {
    // @ts-ignore - useActionState types might be tricky with server actions
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await addCompetitorLink(formData)
        if (result?.error) {
            return { error: result.error }
        }
        return { error: "" }
    }, initialState)

    return (
        <form action={formAction} className="space-y-3">
            <input type="hidden" name="productId" value={productId} />
            <div className="grid gap-2">
                <Label htmlFor="label">Label (e.g. Amazon)</Label>
                <Input
                    id="label"
                    name="label"
                    placeholder="Competitor Name"
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                    id="url"
                    name="url"
                    placeholder="https://..."
                    required
                />
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Adding..." : "Add Link"}
            </Button>
        </form>
    )
}
