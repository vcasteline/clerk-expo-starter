import axios from 'axios';

export const getNuveiAuthToken = async () => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}/nuvei/auth-token`
    );
    return response.data.token;
  } catch (error) {
    console.error("Error obtaining Nuvei auth token:", error);
    throw error;
  }
};

export const getTokenizedCards = async (userId: string) => {
    try {
      const authToken = await getNuveiAuthToken();
      const response = await axios.get(
        `https://ccapi-stg.paymentez.com/v2/card/list?uid=${userId}`,
        {
          headers: {
            'Auth-Token': authToken,
          },
        }
      );
      // console.log("Response from Nuvei:", response.data);
      return response.data.cards;
    } catch (error) {
      console.error("Error fetching tokenized cards from Nuvei:", error);
      throw error;
    }
  };

  export const processNuveiPayment = async (token: string, packageId: string, cardToken: string, amount: number, description: string, vat: number, email: string) => {
    try {
      const authToken = await getNuveiAuthToken();
      // console.log("Auth Token:", authToken);
      
      const payload = {
        user: {
          id: token,
          email: email,
        },
        order: {
          amount: amount,
          description: description,
          dev_reference: packageId,
          vat: vat,
        },
        card: {
          token: cardToken,
        },
      };
      
      console.log("Payload for Nuvei payment:", JSON.stringify(payload, null, 2));
  
      const response = await axios.post(
        'https://ccapi-stg.paymentez.com/v2/transaction/debit/',
        payload,
        {
          headers: {
            'Auth-Token': authToken,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // console.log("Nuvei payment response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Nuvei payment error response:", error.response?.data);
        console.error("Nuvei payment error status:", error.response?.status);
        console.error("Nuvei payment error headers:", error.response?.headers);
      }
      throw error;
    }
  };

  export const updateUserCredits = async (token: string, creditsToAdd: number, userId: string) => {
    try {
      // console.log("Updating user credits with:", { token, creditsToAdd, userId });
  
      // Primero, obtener el número actual de clases disponibles
      const userResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/users/${userId}?fields[0]=clasesDisponibles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const currentClasesDisponibles = userResponse.data.clasesDisponibles || 0;
      const nuevasClasesDisponibles = currentClasesDisponibles + creditsToAdd;
  
      // Ahora, actualizar clasesDisponibles
      const updateResponse = await axios.put(
        `${process.env.EXPO_PUBLIC_BASE_URL}/users/${userId}`,
        { clasesDisponibles: nuevasClasesDisponibles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // console.log("Update user credits response:", updateResponse.data);
      return updateResponse.data;
    } catch (error) {
      console.error("Error updating user credits:", error);
      if (axios.isAxiosError(error)) {
        console.error("Update credits error response:", error.response?.data);
        console.error("Update credits error status:", error.response?.status);
        console.error("Update credits error headers:", error.response?.headers);
      }
      throw error;
    }
  };