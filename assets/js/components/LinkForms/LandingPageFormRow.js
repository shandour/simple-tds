import React from "react";
import styled from "styled-components";

import { CancelButton } from "../Buttons";
import { Row, LandingPageDiv, Badge } from "../PageElements";
import { InputDiv, Input } from "../FormComponents";
import Select from "react-select";

export default ({
  idx,
  data,
  countries,
  deleteLandingPage,
  setLandingPageFieldValue,
  getErrors,
  loading
}) => (
  <Row>
    <FormLandingPageDiv>
      <CenterAlignedRow>
        <Badge text={idx + 1} />
        <CancelButton type="button" onClick={() => deleteLandingPage(idx)}>
          Delete landing page
        </CancelButton>
      </CenterAlignedRow>
      <Row>
        <InputDiv>
          <Input
            type="url"
            name="url"
            onChange={e =>
              setLandingPageFieldValue(idx, e.target.name, e.target.value)
            }
            value={data.url || ""}
            disabled={loading}
            placeholder="Provide a url."
            required
          />
          {getErrors(idx, "url")}
        </InputDiv>
        <SmallerInputDiv>
          <Input
            type="number"
            name="weight"
            min="1"
            onChange={e =>
              setLandingPageFieldValue(idx, e.target.name, e.target.value)
            }
            value={data.weight || 1}
            placeholder="Assign a weight."
            disabled={loading}
          />
          {getErrors(idx, "weight")}
        </SmallerInputDiv>
      </Row>
      <InputDiv>
        <Select
          value={data.country || null}
          name="country"
          onChange={selectedOption =>
            setLandingPageFieldValue(idx, "country", selectedOption)
          }
          options={countries}
          isSearchable
        />

        {getErrors(idx, "url")}
      </InputDiv>
    </FormLandingPageDiv>
  </Row>
);

const FormLandingPageDiv = styled(LandingPageDiv)`
  display: flex;
  flex-direction: column;
`;

const CenterAlignedRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const SmallerInputDiv = styled(InputDiv)`
  max-width: 50px;
`;
