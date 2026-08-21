"use client";

import Link from "next/link";
import SiteMenu from "../components/SiteMenu";

export default function Facilities() {
  return (
    <SiteMenu>
      <div className="flex flex-col w-[90%] my-25 gap-1 sm:justify-center bg-black/90 p-6 text-white sm:p-8 rounded-tl-3xl rounded-br-3xl">
          <h1 className="mb-4 text-2xl font-bold sm:text-3xl text-[#8B0000]">Hall Rules and Regulations of Hall 14</h1>

          <h2 className="mt-4 mb-2 text-xl font-bold sm:text-2xl text-[#a35c00]">Preamble</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            All residents are required to adhere to the &quot;Regulations Governing Student Residence&quot; and the &quot;Code of Student Conduct and Disciplinary Procedure&quot; of the City University of Hong Kong. Furthermore, the subsequent rules and regulations are established to enhance an environment that fosters inclusivity, safety, and residential comfort for all in Hall 14.
          </p>

          <h2 className="mt-4 mb-2 text-xl font-bold sm:text-2xl text-[#a35c00]">Rules &amp; Regulations</h2>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">1. Conduct</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.1 Smoking and drug use are strictly prohibited in all places of the Hall.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.2 Gambling is strictly prohibited.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.3 Playing mahjong is prohibited within the Hall during the designated quiet hours from 11:00pm to 7:00am.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.4 Loud and unreasonable noise during quiet hours (11:00pm to 7:00am) is prohibited. Repeated violations of noise levels may lead to a formal warning or temporary suspension of residence privileges.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.5 Residents should always keep open communication with their roommates about using audio devices (e.g., playing music or making phone calls) in their rooms.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.6 Open flames and the use or storage of inflammable substances are prohibited.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.7 Residents should treat others with respect, kindness, and consideration. This includes refraining from derogatory language or behavior, strictly adhering to anti-discrimination principles, and being mindful of personal space.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.8 Should conflicts arise, it is essential for all involved parties to engage in open and constructive communication, displaying maturity and rationality throughout the process.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.9 Theft, including unauthorized taking of items such as food or beverages from refrigerators or common area property, is a criminal offense and will result in serious consequences, including disciplinary measures and possible involvement of law enforcement.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.10 Residents are expected to safeguard their personal belongings. The Hall Management Team (HMT) is not responsible for any loss or damage to any items brought into the Hall by the residents.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.11 Residents are responsible for maintaining the cleanliness and tidiness of their rooms and shared hall properties, including but not limited to common rooms, toilets, and bathrooms, to ensure a healthy and hygienic living environment at all times. No food waste or unwashed utensils may be left unattended in public areas, and shared facilities must remain clean and odor-free. The Hall Management Team (HMT) may conduct inspections to verify compliance. Failure to adhere to these standards may result in cleaning charges and, for persistent non-compliance, further disciplinary measures.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.12 Residents who willfully vandalize any public properties of the Hall (e.g., windows, walls, furniture, locks, electronic devices) will be subject to disciplinary actions.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">1.13 Residents are expected to respect each other&apos;s privacy and comfort in the use of bathroom and shower facilities, regardless of gender. Residents should keep doors closed and respect personal space in shared facilities.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">2. Visitors</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">2.1 All visitors are required to register at the security counter both upon entry and departure.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">2.2 Visiting hours are from 8:00am to 11:00pm; overnight stays in the Hall are not permitted.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">2.3 Residents and their visitors must obtain explicit consent from the room&apos;s occupant in the case of single rooms, and from both occupants in shared rooms, prior to entering.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">2.4 Residents bear full responsibility for the behavior of their visitors. Kindly ensure your visitors are aware of and adhere to our Hall&apos;s rules and regulations.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">3. Room &amp; Identity</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">3.1 Residents are strictly prohibited from lending or borrowing student identity cards and/or resident cards.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">3.2 Unauthorized use, change, or sharing of room occupancy is prohibited.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">3.3 The HMT reserves the right to conduct room inspections for residents or their visitors who violate the regulations outlined in Sections 1, 2, and 3 above.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">3.4 Residents shall first consult their Residence Tutor (RT) if they wish to swap rooms. They must follow the formal SRO procedure, requiring signatures from both the RT and the Residence Master(RM). Unauthorized room swapping by residents are strictly forbidden.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">4. Cooking &amp; Utensils</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">4.1 Cooking is only allowed in the floor common rooms. Each floor has cooking utensils for sharing, which should be kept clean by the residents and returned to the common room within 24 hours. All public utensils and appliances are owned by the Hall and shall not be taken away.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">4.2 Residents are also welcome to use their own personal cooking utensils if preferred.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">4.3 The HMT reserves the right to dispose of food and drinks from the commonly used refrigerators that are expired, apparently spoiled, seemingly abandoned but unlabeled.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">5. Floor Representatives</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">5.1 The residents of each floor should elect their own representative(s). In the event that residents encounter difficulty in choosing a floor representative, the RT of that particular floor will designate a resident to fulfill this role.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">5.2 Floor representatives are granted the authority and responsibility to offer support in overseeing the affairs of the floor in which they were elected. Should the floor RT be unavailable, residents are welcome to seek assistance from the floor representative.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">6. Student Activities</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.1 Only activities sanctioned by the HMT will be recognized as Official Hall Activities (OHAs). OHAs receive funding from the Hall budget and are covered by the University insurance. Approved OHAs are entitled to utilize Hall resources, such as facilities, social media platforms, and the HMT support.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.2 Organizing OHAs under the Hall&apos;s name necessitates submitting a written proposal to the HMT for prior approval following deliberation. Failure to obtain approval may result in disciplinary actions against organizers and participants.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.3 Any promotion or publication of OHAs under the Hall&apos;s name requires prior approval from the HMT. Failure to secure approval may also lead to disciplinary actions against organizers and participants.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.4 All activities not designated as OHAs are considered as private activities of residents. The use of the Hall name for recruitment or promotional purposes is strictly prohibited. Violations may result in disciplinary measures. Organizers and participants of such activities are responsible for their own liabilities, including lack of financial subsidies from the Hall budget, access to Hall resources, and personal safety without the University insurance coverage.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.5 ONLY promotions and publications of OHAs will be posted on the Hall&apos;s official social media platforms (e.g., Instagram and Facebook) with prior approval from the RM and/or HMT.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.6 Prior approval by the RM/HMT is required for any posting on Hall premises.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.7 The unauthorized use of Hall&apos;s name and official logo on non-official private social media accounts for the purpose of promoting unofficial activities is strictly prohibited. The Hall will not accept any liability arising from such inappropriate usage. Administrators of these accounts are solely responsible for any copyright, privacy, or legal issues that may result from their actions.</p>
          <p className="text-sm leading-relaxed sm:text-base ml-2">6.8 The HMT reserves the right to investigate unauthorized use of the Hall&apos;s name and official logo. This may involve contacting students identified in the photos for clarification, and disciplinary actions within the Hall may be taken against residents involved.</p>

          <h3 className="mt-2 text-sm font-bold leading-relaxed sm:text-base">NB</h3>
          <p className="text-sm leading-relaxed sm:text-base ml-2">The Hall Rules and Regulations of Hall 14 will be updated from time to time. Please contact your Residence Tutors or floor representatives for enquiries. Should any contradictions and disputes arise, the RM and HMT shall reserve the right of final decision.</p>
      </div>
    </SiteMenu>
  );
}
