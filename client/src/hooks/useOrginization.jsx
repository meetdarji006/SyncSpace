import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const useOrginization = ({  }) => {
    const getOrginizations = useQuery({
        queryKey: ['orginizations', userId],
        queryFn: async () => await api.get(`/user/orginizations/${userId}`)
    })

    const createOrginization = useMutation({
        mutationFn: (name) => api.post('/user/orginization', { name: name })
    })

    return { getOrginizations,createOrginization }
}

export default useOrginization;
