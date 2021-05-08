import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../actions";
import Layout from "../../components/Layout";
import Input from "../../components/UI/Input";
import Modal from "../../components/UI/Modal";
import CheckboxTree from "react-checkbox-tree";
import { IoCheckbox, IoCheckboxOutline, IoArrowForward, IoArrowDown } from "react-icons/io5";

import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const Category = (props) => {
  const category = useSelector((state) => state.category);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const dispatch = useDispatch();

  const handleClose = () => {
    const form = new FormData();

    form.append("name", categoryName);
    form.append("parentId", parentCategoryId);
    form.append("categoryImage", categoryImage);
    dispatch(addCategory(form));
    setCategoryName("");
    setParentCategoryId("");

    //const cat = {
    // categoryName,
    // parentCategoryId,
    //  categoryImage,
    // };

    setShow(false);
  };

  const handleShow = () => setShow(true);

  const renderCategories = (categories) => {
    let myCategories = [];

    for (let category of categories) {
      myCategories.push({
        label: category.name,
        value: category._id,
        children:
          category.children.length > 0 && renderCategories(category.children),
      });
    }
    return myCategories;
  };

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };

  const handleCategoryImage = (e) => {
    setCategoryImage(e.target.files[0]);
  };
  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Category</h3>
              <button onClick={handleShow}>Add</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CheckboxTree
              nodes={renderCategories(category.categories)}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
              icons={{
                check: <IoCheckbox />,
                uncheck: <IoCheckboxOutline />,
                halfCheck: <IoCheckboxOutline />,
                expandClose: <IoArrowForward />,
                expandOpen: <IoArrowDown />,
              }}
            />
          </Col>
        </Row>
      </Container>

      <Modal
        show={show}
        handleClose={handleClose}
        modalTitle={"Add new Category"}
      >
        <Input
          value={categoryName}
          placeholder={`Category Name`}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <select
          className="form-control"
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
        >
          <option>Select category</option>
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="categoryImage"
          onChange={handleCategoryImage}
        />
      </Modal>
    </Layout>
  );
};

export default Category;
