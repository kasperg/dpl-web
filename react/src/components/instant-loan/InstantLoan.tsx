import React from "react";
import { Manifestation } from "../../core/utils/types/entities";
import DisclosureControllable from "../Disclosures/DisclosureControllable";
import InstantLoanSummary from "./InstantLoanSummary";
import { HoldingsLogisticsV1 } from "../../core/fbs/model";
import InstantLoanBranch from "./InstantLoanBranch";
import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/instant-loan.css";
import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/tag.css";

type InstantLoanProps = {
  manifestation: Manifestation;
  instantLoanBranchHoldings: HoldingsLogisticsV1[];
};

const InstantLoan: React.FunctionComponent<InstantLoanProps> = ({
  manifestation,
  instantLoanBranchHoldings
}) => {
  const { pid, materialTypes } = manifestation;
  const materialType = materialTypes[0].materialTypeSpecific.display;

  return (
    <DisclosureControllable
      id="instant-loan"
      detailsClassName="disclosure pagefold-parent--small"
      summary={
        <InstantLoanSummary
          pid={pid}
          className="instant-loan__summary cursor-pointer p-24"
        />
      }
      cyData="instant-loan"
    >
      <ul className="instant-loan__branches" data-cy="instant-loan__branches">
        {instantLoanBranchHoldings.map((branch) => {
          return (
            <li key={branch.branch.branchId}>
              <InstantLoanBranch branch={branch} materialType={materialType} />
            </li>
          );
        })}
      </ul>
    </DisclosureControllable>
  );
};

export default InstantLoan;
