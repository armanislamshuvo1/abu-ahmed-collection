// Comprehensive Bangladesh divisions, districts, and thanas/upazilas

export const BANGLADESH_LOCATIONS = {
  Dhaka: {
    districts: {
      Dhaka: {
        isSuburbDistrict: false,
        thanas: [
          // Dhaka City Areas (Inside Dhaka: ৳80)
          'Adabor', 'Badda', 'Bangshal', 'Biman Bandar', 'Cantonment', 'Chawkbazar',
          'Dakshinkhan', 'Darus Salam', 'Demra', 'Dhanmondi', 'Gendaria', 'Gulshan',
          'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kafrul', 'Kalabagan', 'Kamrangirchar',
          'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Mirpur', 'Mohammadpur',
          'Motijheel', 'New Market', 'Paltan', 'Ramna', 'Rampura', 'Sabujbagh',
          'Shah Ali', 'Shahbagh', 'Sher-e-Bangla Nagar', 'Shyampur', 'Sutrapur',
          'Tejgaon', 'Tejgaon Industrial Area', 'Turag', 'Uttar Khan', 'Uttara East',
          'Uttara West', 'Vatara', 'Wari',
          // Dhaka Suburbs (Outside Dhaka: ৳150)
          'Savar', 'Ashulia', 'Dhamrai', 'Keraniganj', 'Dohar', 'Nawabganj'
        ],
        suburbs: ['Savar', 'Ashulia', 'Dhamrai', 'Keraniganj', 'Dohar', 'Nawabganj']
      },
      Gazipur: {
        isSuburbDistrict: true,
        thanas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur']
      },
      Narayanganj: {
        isSuburbDistrict: true,
        thanas: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon']
      },
      Tangail: {
        isSuburbDistrict: true,
        thanas: ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur']
      },
      Faridpur: {
        isSuburbDistrict: true,
        thanas: ['Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha']
      },
      Gopalganj: {
        isSuburbDistrict: true,
        thanas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara']
      },
      Kishoreganj: {
        isSuburbDistrict: true,
        thanas: ['Kishoreganj Sadar', 'Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail']
      },
      Madaripur: {
        isSuburbDistrict: true,
        thanas: ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar']
      },
      Manikganj: {
        isSuburbDistrict: true,
        thanas: ['Manikganj Sadar', 'Daulatpur', 'Ghior', 'Harirampur', 'Saturia', 'Shivalaya', 'Singair']
      },
      Munshiganj: {
        isSuburbDistrict: true,
        thanas: ['Munshiganj Sadar', 'Gazaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar', 'Tongibari']
      },
      Narsingdi: {
        isSuburbDistrict: true,
        thanas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur']
      },
      Rajbari: {
        isSuburbDistrict: true,
        thanas: ['Rajbari Sadar', 'Baliakandi', 'Goalandaghat', 'Pangsha', 'Kalukhali']
      },
      Shariatpur: {
        isSuburbDistrict: true,
        thanas: ['Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zajira']
      }
    }
  },
  Chattogram: {
    districts: {
      Chattogram: { thanas: ['Chattogram Sadar', 'Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'] },
      "Cox's Bazar": { thanas: ["Cox's Bazar Sadar", 'Chakaria', 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhia'] },
      Cumilla: { thanas: ['Cumilla Adarsha Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Monohargonj', 'Muradnagar', 'Nangalkot', 'Titas'] },
      Feni: { thanas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Fulgazi', 'Parshuram', 'Sonagazi'] },
      Brahmanbaria: { thanas: ['Brahmanbaria Sadar', 'Akhaura', 'Ashuganj', 'Bancharampur', 'Bijoynagar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'] },
      Noakhali: { thanas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Kabirhat', 'Senbagh', 'Sonaimuri', 'Subarnachar'] },
      Chandpur: { thanas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab North', 'Matlab South', 'Shahrasti'] },
      Lakshmipur: { thanas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'] },
      Rangamati: { thanas: ['Rangamati Sadar', 'Bagaichhari', 'Barkal', 'Belaichhari', 'Juraichhari', 'Kaptai', 'Kawkhali', 'Langadu', 'Naniarchar', 'Rajasthali'] },
      Khagrachhari: { thanas: ['Khagrachhari Sadar', 'Dighinala', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'] },
      Bandarban: { thanas: ['Bandarban Sadar', 'Ali Kadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'] }
    }
  },
  Rajshahi: {
    districts: {
      Rajshahi: { thanas: ['Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'] },
      Bogura: { thanas: ['Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'] },
      Pabna: { thanas: ['Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'] },
      Sirajganj: { thanas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullapara'] },
      Naogaon: { thanas: ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'] },
      Natore: { thanas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga'] },
      Chapainawabganj: { thanas: ['Chapainawabganj Sadar', 'Bholahat', 'Gomastapur', 'Nachole', 'Shibganj'] },
      Joypurhat: { thanas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'] }
    }
  },
  Khulna: {
    districts: {
      Khulna: { thanas: ['Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha', 'Terokhada'] },
      Jashore: { thanas: ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'] },
      Kushtia: { thanas: ['Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur'] },
      Satkhira: { thanas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala'] },
      Bagerhat: { thanas: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'] },
      Jhenaidah: { thanas: ['Jhenaidah Sadar', 'Harinakundu', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'] },
      Chuadanga: { thanas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'] },
      Magura: { thanas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'] },
      Meherpur: { thanas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'] },
      Narail: { thanas: ['Narail Sadar', 'Kalia', 'Lohagara'] }
    }
  },
  Barishal: {
    districts: {
      Barishal: { thanas: ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'] },
      Bhola: { thanas: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'] },
      Patuakhali: { thanas: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali'] },
      Pirojpur: { thanas: ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Zianagar'] },
      Barguna: { thanas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali'] },
      Jhalokati: { thanas: ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'] }
    }
  },
  Sylhet: {
    districts: {
      Sylhet: { thanas: ['Sylhet Sadar', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Zakiganj'] },
      Moulvibazar: { thanas: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'] },
      Habiganj: { thanas: ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniachong', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj'] },
      Sunamganj: { thanas: ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Shantiganj', 'Sullah', 'Tahirpur'] }
    }
  },
  Rangpur: {
    districts: {
      Rangpur: { thanas: ['Rangpur Sadar', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'] },
      Dinajpur: { thanas: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'] },
      Gaibandha: { thanas: ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'] },
      Kurigram: { thanas: ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Nageshwari', 'Phulbari', 'Rajarhat', 'Raomari', 'Ulipur'] },
      Lalmonirhat: { thanas: ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'] },
      Nilphamari: { thanas: ['Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Syedpur'] },
      Panchagarh: { thanas: ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'] },
      Thakurgaon: { thanas: ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'] }
    }
  },
  Mymensingh: {
    districts: {
      Mymensingh: { thanas: ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gafargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur', 'Tara Khanda', 'Trishal'] },
      Jamalpur: { thanas: ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari'] },
      Netrokona: { thanas: ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala'] },
      Sherpur: { thanas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'] }
    }
  }
};

export const DIVISIONS = Object.keys(BANGLADESH_LOCATIONS);

/**
 * Determines whether the given selection qualifies as Inside Dhaka (City) or Outside Dhaka.
 * - Any division other than Dhaka => 'outside_dhaka'
 * - Any district in Dhaka division other than Dhaka (e.g. Gazipur, Narayanganj) => 'outside_dhaka'
 * - Dhaka district suburbs (Savar, Ashulia, Dhamrai, Keraniganj, Dohar, Nawabganj) => 'outside_dhaka'
 * - Dhaka district city areas => 'inside_dhaka'
 */
export const determineDeliveryZoneKey = (division, district, thana) => {
  if (!division) return 'inside_dhaka';
  if (division !== 'Dhaka') return 'outside_dhaka';
  if (!district) return 'inside_dhaka';
  if (district !== 'Dhaka') return 'outside_dhaka';

  const suburbs = BANGLADESH_LOCATIONS.Dhaka.districts.Dhaka.suburbs;
  if (thana && suburbs.includes(thana)) {
    return 'outside_dhaka';
  }

  return 'inside_dhaka';
};
