export const getDocProfile = async (token) => {
    console.log('execute')
          var myHeader = new Headers();
          myHeader.append("Authorization", `JWT ${token}`);

          var requestOption = {
            method: 'GET',
            headers: myHeader,
            redirect: 'follow'
          };

    const response = await fetch(`${Url}/doctor/profile/`, requestOption)
    const result = await response.json()
    if (!response.ok) {
    // return <Toast message="not Logged in " bg="green-400" />
      setIsLoading(false)
      alert('failed to login')
    }
    await AsyncStorage.setItem('DocId',result.id)    
    navigation.replace("Docprofile");
  }